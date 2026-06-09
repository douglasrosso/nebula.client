"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { usersApi } from "@/lib/api";
import { useStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

/* ─── Styled (same pattern as login) ─── */
const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  background-color: var(--background);
`;

const Wrapper = styled.div`
  width: 100%;
  max-width: 340px;
  animation: fadeIn 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94) both;
`;

const LogoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2.5rem;
`;

const LogoBox = styled.div`
  width: 5rem;
  height: 5rem;
  border-radius: 1.375rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  box-shadow: 0 10px 15px -3px oklch(0 0 0 / 0.1), 0 4px 6px -4px oklch(0 0 0 / 0.1);
  background: linear-gradient(145deg, oklch(0.55 0.26 258), oklch(0.45 0.24 280));
`;

const LogoLetter = styled.span`
  color: white;
  font-weight: 900;
  font-size: 1.875rem;
  letter-spacing: -0.025em;
  user-select: none;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  color: var(--foreground);
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 0.9375rem;
  margin: 0.25rem 0 0;
  color: var(--muted-foreground);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FieldGroup = styled.div`
  border-radius: 0.875rem;
  overflow: hidden;
  background-color: var(--surface-raised);
  border: 1px solid var(--border);
`;

const FieldRow = styled.div`
  padding: 0.875rem 1rem;
`;

const FieldDivider = styled.div`
  height: 1px;
  background-color: var(--border);
`;

const FieldLabel = styled.label`
  display: block;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.375rem;
  color: var(--muted-foreground);
`;

const FieldInput = styled.input`
  width: 100%;
  background: transparent;
  font-size: 1.0625rem;
  color: var(--foreground);
  border: none;
  outline: none;
  &::placeholder { color: var(--text-tertiary); }
`;

const OptionalNote = styled.span`
  font-size: inherit;
  font-weight: normal;
  text-transform: none;
  color: var(--text-tertiary);
`;

const ErrorMessage = styled.p`
  font-size: 0.8125rem;
  padding: 0.625rem 1rem;
  border-radius: 0.625rem;
  color: var(--destructive);
  background-color: color-mix(in oklch, var(--destructive) 10%, transparent);
  margin: 0;
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 3.125rem;
  border-radius: 0.875rem;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--primary-foreground);
  background-color: var(--primary);
  border: none;
  cursor: pointer;
  transition: opacity 150ms;
  display: flex;
  align-items: center;
  justify-content: center;
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const FooterText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.9375rem;
  text-align: center;
  color: var(--muted-foreground);
`;

const FooterLink = styled(Link)`
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: opacity 150ms;
  &:hover { opacity: 0.7; }
`;

export default function CadastroPage() {
  const router = useRouter();
  const { login } = useStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "", confirmPassword: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) { setError("As senhas não coincidem."); return; }
    setLoading(true);
    try {
      await usersApi.create({ name: form.name, email: form.email, username: form.username || undefined, password: form.password });
      await login(form.email, form.password);
      router.replace("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Page>
      <Wrapper>
        <LogoSection>
          <LogoBox>
            <LogoLetter>N</LogoLetter>
          </LogoBox>
          <Title>Criar conta</Title>
          <Subtitle>Junte-se à Nebula</Subtitle>
        </LogoSection>

        <Form onSubmit={handleSubmit}>
          {/* Name + Username */}
          <FieldGroup>
            <FieldRow>
              <FieldLabel htmlFor="name">Nome completo</FieldLabel>
              <FieldInput id="name" name="name" type="text" placeholder="Seu nome" value={form.name} onChange={handleChange} required />
            </FieldRow>
            <FieldDivider />
            <FieldRow>
              <FieldLabel htmlFor="username">
                Usuário <OptionalNote>(opcional)</OptionalNote>
              </FieldLabel>
              <FieldInput id="username" name="username" type="text" placeholder="@usuario" value={form.username} onChange={handleChange} />
            </FieldRow>
          </FieldGroup>

          {/* Email */}
          <FieldGroup>
            <FieldRow>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <FieldInput id="email" name="email" type="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
            </FieldRow>
          </FieldGroup>

          {/* Passwords */}
          <FieldGroup>
            <FieldRow>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <FieldInput id="password" name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </FieldRow>
            <FieldDivider />
            <FieldRow>
              <FieldLabel htmlFor="confirmPassword">Confirmar senha</FieldLabel>
              <FieldInput id="confirmPassword" name="confirmPassword" type="password" placeholder="••••••••" value={form.confirmPassword} onChange={handleChange} required />
            </FieldRow>
          </FieldGroup>

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? <Loader2 style={{ width: "1.25rem", height: "1.25rem", animation: "spin 1s linear infinite" }} /> : "Criar conta"}
          </SubmitButton>
        </Form>

        <FooterText>
          Já tem uma conta?{" "}
          <FooterLink href="/login">Entrar</FooterLink>
        </FooterText>
      </Wrapper>
    </Page>
  );
}
