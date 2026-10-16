// Editá acá los premios. `weight` = probabilidad relativa de salir.
// type: "win" (ganó algo) | "retry" (puede volver a girar)
export const PRIZES = [
  { id: "d20", label: ["20", "OFF"], title: "20 OFF", detail: "de descuento en tu próxima compra", color: "#5e9bea", ink: "#ffffff", weight: 1, type: "win" },
  { id: "accessory", label: ["Un", "accesorio"], title: "Un accesorio", detail: "de regalo para vos", color: "#ffc9d6", ink: "#7a1f3d", weight: 1, type: "win" },
  { id: "retry", label: ["Seguí", "participando"], title: "¡Seguí participando!", detail: "Esta vez no hubo premio, pero podés girar de nuevo.", color: "#ffffff", ink: "#234e92", weight: 1, type: "retry" },
  { id: "d5", label: ["5", "OFF"], title: "5 OFF", detail: "de descuento en tu próxima compra", color: "#dcecff", ink: "#1b3459", weight: 1, type: "win" },
  { id: "body-splash", label: ["Body", "Splash"], title: "Body Splash", detail: "de regalo para vos", color: "#ffe48a", ink: "#5a4300", weight: 1, type: "win" },
  { id: "d40", label: ["40", "OFF"], title: "40 OFF", detail: "de descuento en tu próxima compra", color: "#8fbdf5", ink: "#1b3459", weight: 1, type: "win" },
  { id: "d10", label: ["10", "OFF"], title: "10 OFF", detail: "de descuento en tu próxima compra", color: "#bcd9fb", ink: "#1b3459", weight: 1, type: "win" },
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
