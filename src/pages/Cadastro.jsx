import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useNotification } from '../hooks/useNotification';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { cadastrar } from '../api/autenticacao';
import styles from './Cadastro.module.css';

const Cadastro = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [codigoIngresso, setCodigoIngresso] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cadastrar({ nome, email, senha, codigoIngresso });
      showToast('Cadastro realizado! Faça login.', 'success');
      navigate('/login');
    } catch (error) {
      console.error('Erro no cadastro:', error);
      const msg = error.response?.data?.message || error.response?.data?.erro || 'Erro ao cadastrar';
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Cadastro</h1>
        <form onSubmit={handleSubmit}>
          <Input
            label="Nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
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
          <Input
            label="Código de Ingresso da Equipe"
            name="codigoIngresso"
            value={codigoIngresso}
            onChange={(e) => setCodigoIngresso(e.target.value)}
            required
            placeholder="Ex: ABC123"
          />
          <Button type="submit" disabled={loading} className={styles.submit}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Button>
        </form>
        <p className={styles.loginLink}>
          Já tem conta? <Link to="/login">Faça login</Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
