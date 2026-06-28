import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotification } from '../hooks/useNotification';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import styles from './Login.module.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, senha);
      showToast('Login realizado com sucesso!', 'success');
      navigate('/teams');
    } catch (error) {
      console.error('Erro no login:', error);
      const msg = error.response?.data?.message || error.response?.data?.erro || 'Erro ao fazer login';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="E-mail"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Senha"
            type="password"
            name="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <Button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
        <p className={styles.registerLink}>
          Não tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
