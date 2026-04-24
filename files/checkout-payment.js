// ====== PAGO MERCADOPAGO VIBEWEAR ======

async function pagar() {
  const cart = JSON.parse(localStorage.getItem("vibewear-cart")) || [];

  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  // 🧠 Obtener datos del cliente desde el checkout
  const customer = {
    name: document.getElementById("fullName")?.value || "",
    email: document.getElementById("email")?.value || "",
    phone: document.getElementById("phone")?.value || "",
    address: document.getElementById("address")?.value || ""
  };

  // 🚨 Validación básica
  if (!customer.name || !customer.email) {
    alert("Por favor completa nombre y correo");
    return;
  }

  // Convertir carrito → formato MercadoPago
  const itemsMP = cart.map(product => ({
    title: `${product.name}${product.size ? " - Talla " + product.size : ""}${product.color ? " - " + product.color : ""}`,
    quantity: Number(product.quantity),
    currency_id: "COP",
    unit_price: Number(
      String(product.price)
        .replace(/\$/g, "")
        .replace(/\./g, "")
        .replace(/,/g, "")
    )
  }));

  try {
    const response = await fetch("https://vibewear-server-w0z2.onrender.com/create-preference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
        body: JSON.stringify({
          items: req.body.items,
          metadata: {
            customer: req.body.customer
          },
        }),
      });

    const data = await response.json();

    if (!data.init_point) {
      throw new Error("No se recibió init_point");
    }

    // Redirigir a MercadoPago
    window.location.href = data.init_point;

  } catch (error) {
    console.error("Error creando pago:", error);
    alert("Error iniciando el pago. Intenta nuevamente.");
  }
}