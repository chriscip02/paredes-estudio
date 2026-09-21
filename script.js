// ======================================================
// CONFIGURACIÓN DE WHATSAPP
// ======================================================

// Código de país + 9 + código de área + número.
// Sin espacios, guiones, paréntesis ni signo +.
const WHATSAPP_NUMBER = "5491141937153";

const DEFAULT_MESSAGE =
  "Hola, quisiera realizar una consulta con PAREDES. Estudio Jurídico.";

function openWhatsApp(message = DEFAULT_MESSAGE) {
  if (
    !WHATSAPP_NUMBER ||
    WHATSAPP_NUMBER.includes("X")
  ) {
    alert(
      "Falta configurar el número de WhatsApp en el archivo script.js."
    );

    return;
  }

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}` +
    `?text=${encodeURIComponent(message)}`;

  window.open(
    whatsappURL,
    "_blank",
    "noopener,noreferrer"
  );
}

// Botones generales de WhatsApp

document
  .querySelectorAll(".whatsapp-link")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const customMessage =
        link.dataset.message || DEFAULT_MESSAGE;

      openWhatsApp(customMessage);
    });
  });

// ======================================================
// ENLACES DE LAS TARJETAS DE CASOS
// ======================================================

document
  .querySelectorAll(".case-card a")
  .forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();

      const card = link.closest(".case-card");

      const caseTitle =
        card?.querySelector("h3")?.textContent ||
        "una consulta jurídica";

      openWhatsApp(
        `Hola, quisiera consultar por esta situación: ${caseTitle}.`
      );
    });
  });

// Enlace de la presentación del abogado

const lawyerLink =
  document.querySelector(".lawyer a");

if (lawyerLink) {
  lawyerLink.addEventListener("click", (event) => {
    event.preventDefault();

    openWhatsApp(DEFAULT_MESSAGE);
  });
}

// ======================================================
// FORMULARIO DE CONTACTO A WHATSAPP
// ======================================================

const contactForm =
  document.querySelector("#contact-form");

const formStatus =
  document.querySelector("#form-status");

if (contactForm) {
  contactForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData =
        new FormData(contactForm);

      const name =
        formData.get("nombre")?.trim();

      const phone =
        formData.get("telefono")?.trim();

      const email =
        formData.get("email")?.trim();

      const consultation =
        formData.get("consulta")?.trim();

      let message =
        `Hola, soy ${name}.\n\n` +
        `Quisiera realizar una consulta con ` +
        `PAREDES. Estudio Jurídico.\n\n` +
        `Teléfono: ${phone}\n`;

      if (email) {
        message += `Email: ${email}\n`;
      }

      message +=
        `\nMi consulta:\n${consultation}`;

      if (formStatus) {
        formStatus.textContent =
          "Abriendo WhatsApp con tu consulta...";
      }

      openWhatsApp(message);
    }
  );
}

// ======================================================
// CALCULADORA ORIENTATIVA DE INDEMNIZACIÓN ART
// ======================================================

const calculatorForm =
  document.querySelector("#calculator-form");

const calculatorResult =
  document.querySelector("#calculator-result");

const calculatorWhatsApp =
  document.querySelector("#calculator-whatsapp");

let lastCalculation = null;

function formatCurrency(value) {
  return value.toLocaleString("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0
  });
}

if (calculatorForm) {
  calculatorForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();

      if (!calculatorForm.checkValidity()) {
        calculatorForm.reportValidity();
        return;
      }

      const income = Number(
        document.querySelector(
          "#calc-income"
        ).value
      );

      const age = Number(
        document.querySelector(
          "#calc-age"
        ).value
      );

      const disability = Number(
        document.querySelector(
          "#calc-disability"
        ).value
      );

      const accidentType =
        document.querySelector(
          "#calc-type"
        ).value;

      if (
        income <= 0 ||
        age < 16 ||
        age > 64 ||
        disability <= 0 ||
        disability > 65
      ) {
        return;
      }

      /*
       * Fórmula general:
       *
       * 53 × ingreso base × porcentaje de incapacidad × 65 / edad
       *
       * Si el accidente ocurrió dentro del trabajo,
       * se agrega un 20%.
       *
       * En accidentes in itinere no se agrega ese 20%.
       */

      const baseCompensation =
        53 *
        income *
        (disability / 100) *
        (65 / age);

      const estimatedCompensation =
        accidentType === "workplace"
          ? baseCompensation * 1.2
          : baseCompensation;

      lastCalculation = {
        income,
        age,
        disability,
        accidentType,
        estimatedCompensation
      };

      if (calculatorResult) {
        const resultAmount =
          calculatorResult.querySelector(
            "strong"
          );

        const resultExplanation =
          calculatorResult.querySelector(
            "p"
          );

        if (resultAmount) {
          resultAmount.textContent =
            formatCurrency(
              estimatedCompensation
            );
        }

        if (resultExplanation) {
          resultExplanation.textContent =
            "Estimación base orientativa. Deben verificarse RIPTE, piso mínimo, fecha del accidente, incapacidad definitiva y demás condiciones del caso.";
        }
      }

      if (calculatorWhatsApp) {
        calculatorWhatsApp.disabled = false;
      }
    }
  );
}

// Enviar resultado de la calculadora por WhatsApp

if (calculatorWhatsApp) {
  calculatorWhatsApp.addEventListener(
    "click",
    () => {
      if (!lastCalculation) {
        return;
      }

      const accidentDescription =
        lastCalculation.accidentType ===
        "workplace"
          ? "Accidente ocurrido en el trabajo"
          : "Accidente in itinere";

      const message =
        "Hola, utilicé la calculadora de la página de " +
        "PAREDES. Estudio Jurídico.\n\n" +
        `Ingreso base ingresado: ${formatCurrency(
          lastCalculation.income
        )}\n` +
        `Edad: ${lastCalculation.age} años\n` +
        `Incapacidad estimada: ${lastCalculation.disability}%\n` +
        `Tipo: ${accidentDescription}\n` +
        `Resultado orientativo: ${formatCurrency(
          lastCalculation.estimatedCompensation
        )}\n\n` +
        "Quisiera consultar mi caso y verificar este cálculo.";

      openWhatsApp(message);
    }
  );
}

// ======================================================
// MENÚ PARA CELULARES
// ======================================================

const menuButton =
  document.querySelector(".menu-button");

const navigation =
  document.querySelector(".navigation");

if (menuButton && navigation) {
  menuButton.addEventListener(
    "click",
    () => {
      const menuIsOpen =
        menuButton.getAttribute(
          "aria-expanded"
        ) === "true";

      menuButton.setAttribute(
        "aria-expanded",
        String(!menuIsOpen)
      );

      menuButton.setAttribute(
        "aria-label",
        menuIsOpen
          ? "Abrir menú"
          : "Cerrar menú"
      );

      navigation.classList.toggle(
        "open",
        !menuIsOpen
      );

      document.body.classList.toggle(
        "menu-open",
        !menuIsOpen
      );
    }
  );

  navigation
    .querySelectorAll("a")
    .forEach((link) => {
      link.addEventListener(
        "click",
        () => {
          menuButton.setAttribute(
            "aria-expanded",
            "false"
          );

          menuButton.setAttribute(
            "aria-label",
            "Abrir menú"
          );

          navigation.classList.remove(
            "open"
          );

          document.body.classList.remove(
            "menu-open"
          );
        }
      );
    });
}

// ======================================================
// ENCABEZADO AL HACER SCROLL
// ======================================================

const header =
  document.querySelector(".header");

function updateHeader() {
  if (!header) {
    return;
  }

  header.classList.toggle(
    "scrolled",
    window.scrollY > 20
  );
}

window.addEventListener(
  "scroll",
  updateHeader,
  {
    passive: true
  }
);

updateHeader();

// ======================================================
// ANIMACIONES AL APARECER LAS SECCIONES
// ======================================================

const revealElements =
  document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer =
    new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );
          }
        });
      },
      {
        threshold: 0.1
      }
    );

  revealElements.forEach(
    (element) => {
      observer.observe(element);
    }
  );
} else {
  revealElements.forEach(
    (element) => {
      element.classList.add("visible");
    }
  );
}

// ======================================================
// PREGUNTAS FRECUENTES
// ======================================================

document
  .querySelectorAll(".faq-item button")
  .forEach((button) => {
    button.addEventListener(
      "click",
      () => {
        const faqItem =
          button.closest(".faq-item");

        if (!faqItem) {
          return;
        }

        const isOpen =
          faqItem.classList.toggle("open");

        button.setAttribute(
          "aria-expanded",
          String(isOpen)
        );
      }
    );
  });

// ======================================================
// AÑO AUTOMÁTICO DEL PIE DE PÁGINA
// ======================================================

const yearElement =
  document.querySelector("#year");

if (yearElement) {
  yearElement.textContent =
    new Date().getFullYear();
}