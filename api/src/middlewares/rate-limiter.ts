import rateLimit from "express-rate-limit"

function createRateLimiter(windowMinutes: number, max: number, message: string) {
  return rateLimit({
    windowMs: windowMinutes * 60 * 1000,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    message: { message },
  })
}

// Limita a criação de contas por IP, pra dificultar spam de cadastro.
export const createAccountLimiter = createRateLimiter(
  60,
  5,
  "Muitas contas criadas a partir deste IP. Tente novamente em 1 hora."
)

// Limita envio de solicitações de reembolso e uploads de comprovante por IP.
export const submissionLimiter = createRateLimiter(
  15,
  10,
  "Muitas solicitações em pouco tempo. Tente novamente em alguns minutos."
)
