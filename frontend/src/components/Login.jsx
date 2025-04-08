import { Link } from "react-router-dom";
import { useState } from "react";
import { Eye, EyeOff } from "react-feather";

const Login = ({ onLogin }) => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.email || !data.password) {
      setError("Preencha todos os campos.");
      return;
    }
    setError(null);
    try {
      await onLogin(data);
    } catch {
      alert("Erro ao fazer login. Verifique suas credenciais.");
      setError("Erro ao fazer login. Verifique suas credenciais.");
    }
  };

  return (
    <div className="login__container">
      <p className="login__welcome">Entrar</p>
      <form className="login__form" onSubmit={handleSubmit}>
        <label htmlFor="email"></label>
        <input
          id="email"
          required
          name="email"
          type="email"
          placeholder="E-mail"
          value={data.email}
          onChange={handleChange}
        />
        <label htmlFor="password"></label>
        <input
          id="password"
          required
          name="password"
          placeholder="Senha"
          value={data.password}
          type={showPassword ? "text" : "password"}
          onChange={handleChange}
        />
        <button
          type="button"
          className="toggle-password"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
        <div className="login__button-container">
          <button type="submit" className="login__button">
            Entrar
          </button>
        </div>
      </form>

      <div className="login__signup">
        <p>Ainda não é membro?</p>
        <Link to="/signup" className="signup__link">
          Inscreva-se aqui
        </Link>
      </div>
    </div>
  );
};

export default Login;
