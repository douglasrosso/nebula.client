"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { useStore } from "@/lib/store";
import { Loader2 } from "lucide-react";

/* ─── Styled ─── */
const Page = styled.main`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 1.5rem;
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

const Footer = styled.div`
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  text-align: center;
`;

const FooterText = styled.p`
  font-size: 0.9375rem;
  color: var(--muted-foreground);
  margin: 0;
`;

const FooterLink = styled(Link)`
  font-weight: 600;
  color: var(--primary);
  text-decoration: none;
  transition: opacity 150ms;
  &:hover { opacity: 0.7; }
`;

const TestAccountNote = styled.p`
  font-size: 0.8125rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--border);
  color: var(--text-tertiary);
  margin: 0;
`;

const Mono = styled.span`
  font-family: var(--font-mono), monospace;
  font-size: 0.75rem;
`;

/* ─── Login Form ─── */
function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, authLoading } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const redirect = searchParams.get("redirect") ?? "/";

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      router.replace(redirect);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Credenciais inválidas");
    }
  };

  return (
    <Wrapper>
      <LogoSection>
        <LogoBox>
          <LogoLetter>N</LogoLetter>
        </LogoBox>
        <Title>Nebula</Title>
        <Subtitle>Entre na sua conta para continuar</Subtitle>
      </LogoSection>

      <Form onSubmit={handleSubmit}>
        <FieldGroup>
          <FieldRow>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <FieldInput
              id="email" type="email" placeholder="seu@email.com"
              value={email} onChange={(e) => setEmail(e.target.value)}
              required
            />
          </FieldRow>
          <FieldDivider />
          <FieldRow>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <FieldInput
              id="password" type="password" placeholder="••••••••"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
            />
          </FieldRow>
        </FieldGroup>

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <SubmitButton type="submit" disabled={authLoading}>
          {authLoading ? <Loader2 style={{ width: "1.25rem", height: "1.25rem", animation: "spin 1s linear infinite" }} /> : "Entrar"}
        </SubmitButton>
      </Form>

      <Footer>
        <FooterText>
          Não tem conta?{" "}
          <FooterLink href="/cadastro">Criar conta</FooterLink>
        </FooterText>
        <TestAccountNote>
          Conta de teste:{" "}
          <Mono>admin@nebula.com</Mono>
          {" / "}
          <Mono>Admin@123</Mono>
        </TestAccountNote>
      </Footer>
    </Wrapper>
  );
}

export default function LoginPage() {
  return (
    <Page>
      <Suspense>
        <LoginForm />
      </Suspense>
    </Page>
  );
}
