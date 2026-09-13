import React, { useState } from "react";
import {
  Lock,
  Mail,
  KeyRound,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  LogOut,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { getSupabase } from "../../lib/supabase";
import { siteContentService } from "../../services/siteContentService";
import type { SiteContent } from "../../types/content";

interface AdminAuthModalProps {
  content: SiteContent;
  onSuccess: (user: any) => void;
  onClose: () => void;
}

export const AdminAuthModal: React.FC<AdminAuthModalProps> = ({
  content,
  onSuccess,
  onClose,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "register" | "otp">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [unauthorizedUser, setUnauthorizedUser] = useState<any | null>(null);

  const supabase = getSupabase();

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!supabase) {
      setErrorMsg("Подключение к Supabase не настроено.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Укажите email администратора.");
      return;
    }

    setLoading(true);

    try {
      if (authMode === "login") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          // Если аккаунт не найден или пароль не задан, подскажем перейти в регистрацию
          if (error.message.includes("Invalid login credentials")) {
            setErrorMsg("Неверный пароль или аккаунт ещё не создан. Если вы входите впервые — переключитесь на 'Создать пароль / Регистрация'.");
          } else {
            setErrorMsg(error.message);
          }
          setLoading(false);
          return;
        }

        if (data.user) {
          if (siteContentService.isUserAllowedAdmin(data.user, content)) {
            onSuccess(data.user);
          } else {
            setUnauthorizedUser(data.user);
            setErrorMsg("Доступ запрещен. У данной учетной записи нет прав администратора.");
          }
        }
      } else if (authMode === "register") {
        // Регистрация / установка пароля для администратора
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message);
          setLoading(false);
          return;
        }

        if (data.session && data.user) {
          if (siteContentService.isUserAllowedAdmin(data.user, content)) {
            onSuccess(data.user);
          } else {
            setUnauthorizedUser(data.user);
            setErrorMsg("Аккаунт создан, но у него нет прав администратора.");
          }
        } else if (data.user) {
          setSuccessMsg("Аккаунт создан! Если включено подтверждение email, проверьте почту или войдите.");
          setAuthMode("login");
        }
      } else if (authMode === "otp") {
        // Вход по одноразовой ссылке на почту (Magic link)
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: window.location.href,
          },
        });

        if (error) {
          setErrorMsg(error.message);
        } else {
          setSuccessMsg("Ссылка для мгновенного входа отправлена на вашу почту!");
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ошибка авторизации.");
    } finally {
      setLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    setErrorMsg(null);
    if (!supabase) {
      setErrorMsg("Подключение к Supabase не настроено.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: window.location.href,
        },
      });

      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Ошибка входа через GitHub.");
      setLoading(false);
    }
  };

  const handleSignOutUnauthorized = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUnauthorizedUser(null);
    setErrorMsg(null);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-card">
        <div className="admin-modal-header">
          <div className="admin-lock-badge">
            <Lock size={22} className="text-amber-600" />
          </div>
          <h3>Панель управления GoldHands</h3>
          <p className="admin-modal-subtitle">
            Вход только для владельца сайта
          </p>
        </div>

        {unauthorizedUser ? (
          <div className="admin-unauthorized-box">
            <AlertCircle size={32} className="text-red-500" />
            <h4>Доступ отклонен</h4>
            <p>
              Вы вошли как <strong>{unauthorizedUser.email || unauthorizedUser.user_metadata?.user_name}</strong>.
              У данной учетной записи нет прав для управления сайтом.
            </p>
            <div className="admin-modal-actions">
              <button
                type="button"
                className="admin-btn secondary"
                onClick={handleSignOutUnauthorized}
              >
                <LogOut size={16} />
                <span>Войти под другим аккаунтом</span>
              </button>
              <button
                type="button"
                className="admin-btn text-btn"
                onClick={onClose}
              >
                Вернуться на сайт
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Переключатель входа */}
            <div className="admin-auth-tabs">
              <button
                type="button"
                className={`admin-tab-btn ${authMode === "login" ? "active" : ""}`}
                onClick={() => { setAuthMode("login"); setErrorMsg(null); }}
              >
                Вход по паролю
              </button>
              <button
                type="button"
                className={`admin-tab-btn ${authMode === "register" ? "active" : ""}`}
                onClick={() => { setAuthMode("register"); setErrorMsg(null); }}
              >
                Создать пароль
              </button>
              <button
                type="button"
                className={`admin-tab-btn ${authMode === "otp" ? "active" : ""}`}
                onClick={() => { setAuthMode("otp"); setErrorMsg(null); }}
              >
                Magic Link
              </button>
            </div>

            {errorMsg && (
              <div className="admin-alert error">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="admin-alert success">
                <CheckCircle2 size={16} />
                <span>{successMsg}</span>
              </div>
            )}

            <form onSubmit={handleEmailAuth} className="admin-auth-form">
              <div className="admin-form-group">
                <label>Email администратора</label>
                <div className="admin-input-wrapper">
                  <Mail size={16} className="input-icon" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                    autoComplete="email"
                  />
                </div>
              </div>

              {authMode !== "otp" && (
                <div className="admin-form-group">
                  <label>Пароль</label>
                  <div className="admin-input-wrapper">
                    <KeyRound size={16} className="input-icon" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      autoComplete={authMode === "login" ? "current-password" : "new-password"}
                      minLength={6}
                    />
                  </div>
                  {authMode === "register" && (
                    <span className="admin-hint">Минимум 6 символов</span>
                  )}
                </div>
              )}

              <button
                type="submit"
                className="admin-btn primary w-full"
                disabled={loading}
              >
                {loading ? (
                  <span>Проверка...</span>
                ) : (
                  <>
                    <span>
                      {authMode === "login"
                        ? "Войти в админку"
                        : authMode === "register"
                        ? "Зарегистрировать и войти"
                        : "Отправить ссылку на почту"}
                    </span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="admin-divider">
              <span>или через GitHub</span>
            </div>

            <button
              type="button"
              className="admin-btn github w-full"
              onClick={handleGithubLogin}
              disabled={loading}
            >
              <FaGithub size={18} />
              <span>Войти через GitHub OAuth</span>
            </button>

            <div className="admin-modal-footer">
              <button
                type="button"
                className="admin-text-link"
                onClick={onClose}
              >
                ← Вернуться на главную страницу
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
