// Editá acá los premios. `weight` = probabilidad relativa de salir.
// type: "win" (ganó algo) | "retry" (puede volver a girar)
export const PRIZES = [
  { id: "d5-a", label: ["5🏷️", "OFF"], title: "5 Off 🏷️ de descuento", detail: "en tu próxima compra", color: "#dcecff", ink: "#1b3459", weight: 18, type: "win" },
  { id: "retry-a", label: ["Seguí", "participando"], title: "¡Seguí participando!", detail: "Esta vez no hubo premio, pero podés girar de nuevo.", color: "#ffffff", ink: "#234e92", weight: 14, type: "retry" },
  { id: "d10", label: ["10🏷️", "OFF"], title: "10 Off🏷️ de descuento", detail: "en tu próxima compra", color: "#8fbdf5", ink: "#1b3459", weight: 14, type: "win" },
  { id: "surprise", label: ["Premio", "sorpresa"], title: "¡Premio sorpresa!", detail: "Pasá por el local y descubrí qué te tocó", color: "#ffe48a", ink: "#5a4300", weight: 8, type: "win" },
  { id: "d20", label: ["20🏷️", "OFF"], title: "20 Off🏷️ de descuento", detail: "en tu próxima compra", color: "#5e9bea", ink: "#ffffff", weight: 6, type: "win" },
  { id: "retry-b", label: ["Seguí", "participando"], title: "¡Seguí participando!", detail: "Esta vez no hubo premio, pero podés girar de nuevo.", color: "#ffffff", ink: "#234e92", weight: 14, type: "retry" },
  { id: "voucher", label: ["Voucher", "$50.000"], title: "Voucher de $50.000", detail: "para canjear en Blue", color: "#ffc9d6", ink: "#7a1f3d", weight: 2, type: "win" },
  { id: "d5-b", label: ["5🏷️", "OFF"], title: "5 Off🏷️ de descuento", detail: "en tu próxima compra", color: "#bcd9fb", ink: "#1b3459", weight: 18, type: "win" },
];

export function pickPrizeIndex() {
  const total = PRIZES.reduce((s, p) => s + p.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < PRIZES.length; i++) {
    r -= PRIZES[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}
