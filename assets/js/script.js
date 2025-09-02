// Importation de GSAP et ScrollTrigger via CDN
const gsap = window.gsap
const ScrollTrigger = window.ScrollTrigger

// Variables globales
let isMenuOpen = false

// Attendre que le DOM soit chargé
document.addEventListener("DOMContentLoaded", () => {
  // Wait for GSAP to load from CDN
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger)
  }

  initNavigation()
  initAnimations()
  initProjectFilter()
  initContactForm()
  initScrollEffects()
})

// Navigation mobile
function initNavigation() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const body = document.body

  // Create overlay element
  let overlay = document.querySelector('.nav-overlay')
  if (!overlay) {
    overlay = document.createElement('div')
    overlay.className = 'nav-overlay'
    document.body.appendChild(overlay)
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      isMenuOpen = !isMenuOpen
      navMenu.classList.toggle("active")
      overlay.classList.toggle("active")
      body.classList.toggle("menu-open")

      // Animation des barres du menu hamburger
      const bars = navToggle.querySelectorAll(".bar")
      if (isMenuOpen) {
        bars[0].style.transform = "rotate(-45deg) translate(-5px, 6px)"
        bars[1].style.opacity = "0"
        bars[2].style.transform = "rotate(45deg) translate(-5px, -6px)"
      } else {
        bars[0].style.transform = "none"
        bars[1].style.opacity = "1"
        bars[2].style.transform = "none"
      }
    })

    // Close menu when overlay is clicked
    overlay.addEventListener('click', () => {
      if (isMenuOpen) {
        navMenu.classList.remove('active')
        overlay.classList.remove('active')
        body.classList.remove('menu-open')
        isMenuOpen = false
        const bars = navToggle.querySelectorAll(".bar")
        bars[0].style.transform = "none"
        bars[1].style.opacity = "1"
        bars[2].style.transform = "none"
      }
    })

    // Fermer le menu lors du clic sur un lien
    const navLinks = navMenu.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (isMenuOpen) {
          navMenu.classList.remove("active")
          overlay.classList.remove("active")
          body.classList.remove("menu-open")
          isMenuOpen = false
          const bars = navToggle.querySelectorAll(".bar")
          bars[0].style.transform = "none"
          bars[1].style.opacity = "1"
          bars[2].style.transform = "none"
        }
      })
    })
  }
}

// Animations GSAP
function initAnimations() {
  // Check if GSAP is available
  if (typeof gsap === "undefined") {
    console.warn("GSAP not loaded, skipping animations")
    return
  }

  // Animation du hero - simplified without initial opacity
  if (document.querySelector(".hero-title")) {
    const tl = gsap.timeline()

    tl.fromTo(".hero-title", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out" })
      .fromTo(".hero-subtitle", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.5")
      .fromTo(".hero-buttons", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, "-=0.3")
  }

  // Animation des cartes de service - simplified
  gsap.utils.toArray(".service-card").forEach((card, index) => {
    gsap.fromTo(
      card,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        delay: index * 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: card,
          start: "top 80%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      },
    )
  })

  // Animation des projets
  gsap.utils.toArray(".project-item").forEach((item, index) => {
    gsap.to(item, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: item,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })
  })

  // Animation des détails de service
  gsap.utils.toArray(".service-detail").forEach((detail, index) => {
    gsap.to(detail, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: "power2.out",
      scrollTrigger: {
        trigger: detail,
        start: "top 70%",
        end: "bottom 30%",
        toggleActions: "play none none reverse",
      },
    })
  })

  // Animation des membres de l'équipe
  gsap.utils.toArray(".team-member").forEach((member, index) => {
    gsap.to(member, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      delay: index * 0.2,
      ease: "power2.out",
      scrollTrigger: {
        trigger: member,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })
  })

  // Animation des statistiques
  gsap.utils.toArray(".stat-number").forEach((stat) => {
    const finalValue = Number.parseInt(stat.textContent)
    gsap.fromTo(
      stat,
      { textContent: 0 },
      {
        textContent: finalValue,
        duration: 2,
        ease: "power2.out",
        snap: { textContent: 1 },
        scrollTrigger: {
          trigger: stat,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      },
    )
  })
}

// Filtre des projets
function initProjectFilter() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const projectItems = document.querySelectorAll(".project-item")

  if (filterButtons.length > 0 && projectItems.length > 0) {
    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const filter = this.getAttribute("data-filter")

        // Mettre à jour les boutons actifs
        filterButtons.forEach((btn) => btn.classList.remove("active"))
        this.classList.add("active")

        // Filtrer les projets avec animation
        projectItems.forEach((item) => {
          const category = item.getAttribute("data-category")

          if (filter === "all" || category === filter) {
            gsap.to(item, {
              opacity: 1,
              scale: 1,
              duration: 0.3,
              display: "block",
              ease: "power2.out",
            })
          } else {
            gsap.to(item, {
              opacity: 0,
              scale: 0.8,
              duration: 0.3,
              ease: "power2.out",
              onComplete: () => {
                item.style.display = "none"
              },
            })
          }
        })
      })
    })
  }
}

// Formulaire de contact
function initContactForm() {
  const contactForm = document.getElementById("contactForm")

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Validation côté client
      if (validateForm()) {
        submitForm()
      }
    })

    // Validation en temps réel
    const inputs = contactForm.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this)
      })

      input.addEventListener("input", function () {
        clearError(this)
      })
    })
  }
}

// Validation du formulaire
function validateForm() {
  let isValid = true
  const form = document.getElementById("contactForm")

  // Validation du nom
  const nom = form.querySelector("#nom")
  if (!nom.value.trim() || nom.value.trim().length < 2) {
    showError(nom, "Le nom doit contenir au moins 2 caractères.")
    isValid = false
  }

  // Validation de l'email
  const email = form.querySelector("#email")
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!email.value.trim() || !emailRegex.test(email.value)) {
    showError(email, "Veuillez saisir une adresse email valide.")
    isValid = false
  }

  // Validation du téléphone (si fourni)
  const telephone = form.querySelector("#telephone")
  if (telephone.value.trim() && !/^[0-9+\-\s$$$$.]{8,20}$/.test(telephone.value)) {
    showError(telephone, "Le format du téléphone n'est pas valide.")
    isValid = false
  }

  // Validation du message
  const message = form.querySelector("#message")
  if (!message.value.trim() || message.value.trim().length < 10) {
    showError(message, "Le message doit contenir au moins 10 caractères.")
    isValid = false
  }

  // Validation RGPD
  const rgpd = form.querySelector("#rgpd")
  if (!rgpd.checked) {
    showError(rgpd, "Vous devez accepter l'utilisation de vos données.")
    isValid = false
  }

  return isValid
}

// Validation d'un champ individuel
function validateField(field) {
  const fieldName = field.getAttribute("name")

  switch (fieldName) {
    case "nom":
      if (!field.value.trim() || field.value.trim().length < 2) {
        showError(field, "Le nom doit contenir au moins 2 caractères.")
        return false
      }
      break
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!field.value.trim() || !emailRegex.test(field.value)) {
        showError(field, "Veuillez saisir une adresse email valide.")
        return false
      }
      break
    case "telephone":
      if (field.value.trim() && !/^[0-9+\-\s$$$$.]{8,20}$/.test(field.value)) {
        showError(field, "Le format du téléphone n'est pas valide.")
        return false
      }
      break
    case "message":
      if (!field.value.trim() || field.value.trim().length < 10) {
        showError(field, "Le message doit contenir au moins 10 caractères.")
        return false
      }
      break
  }

  clearError(field)
  return true
}

// Afficher une erreur
function showError(field, message) {
  const errorElement = document.getElementById(field.getAttribute("name") + "-error")
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"
  }
  field.classList.add("error")
}

// Effacer une erreur
function clearError(field) {
  const errorElement = document.getElementById(field.getAttribute("name") + "-error")
  if (errorElement) {
    errorElement.textContent = ""
    errorElement.style.display = "none"
  }
  field.classList.remove("error")
}

// Soumettre le formulaire
function submitForm() {
  const form = document.getElementById("contactForm")
  const submitButton = form.querySelector('button[type="submit"]')
  const originalText = submitButton.textContent

  // Désactiver le bouton et changer le texte
  submitButton.disabled = true
  submitButton.textContent = "Envoi en cours..."

  // Préparer les données
  const formData = new FormData(form)

  // Envoyer via fetch
  fetch("contact.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const contentType = response.headers.get("content-type")
      if (contentType && contentType.indexOf("application/json") !== -1) {
        return response.json()
      } else {
        // If not JSON, get text to see what was returned
        return response.text().then((text) => {
          console.error("Expected JSON but received:", text)
          throw new Error("Le serveur a retourné une réponse invalide")
        })
      }
    })
    .then((data) => {
      const messagesDiv = document.getElementById("form-messages")

      if (data.success) {
        messagesDiv.textContent = data.message
        messagesDiv.className = "success"
        messagesDiv.style.display = "block"
        form.reset()

        // Animation de succès
        if (typeof gsap !== "undefined") {
          gsap.fromTo(messagesDiv, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" })
        }
      } else {
        // Afficher les erreurs
        if (data.errors) {
          Object.keys(data.errors).forEach((fieldName) => {
            const field = form.querySelector(`[name="${fieldName}"]`)
            if (field) {
              showError(field, data.errors[fieldName])
            }
          })
        }

        if (data.errors && data.errors.general) {
          messagesDiv.textContent = data.errors.general
          messagesDiv.className = "error"
          messagesDiv.style.display = "block"
        }
      }
    })
    .catch((error) => {
      console.error("Erreur:", error)
      const messagesDiv = document.getElementById("form-messages")
      messagesDiv.textContent = "Une erreur est survenue. Veuillez réessayer."
      messagesDiv.className = "error"
      messagesDiv.style.display = "block"
    })
    .finally(() => {
      // Réactiver le bouton
      submitButton.disabled = false
      submitButton.textContent = originalText
    })
}

// Effets de scroll
function initScrollEffects() {
  // Navbar transparente au scroll
  const navbar = document.querySelector(".navbar")
  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        navbar.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
        navbar.style.backdropFilter = "blur(10px)"
      } else {
        navbar.style.backgroundColor = "#ffffff"
        navbar.style.backdropFilter = "none"
      }
    })
  }

  // Smooth scroll pour les ancres
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href").substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80 // Compensation pour la navbar fixe
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Parallax léger pour le hero
  const hero = document.querySelector(".hero")
  if (hero) {
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset
      const rate = scrolled * -0.5
      hero.style.transform = `translateY(${rate}px)`
    })
  }
}

// Utilitaires
function debounce(func, wait, immediate) {
  let timeout
  return function executedFunction() {
    const args = arguments
    const later = () => {
      timeout = null
      if (!immediate) func.apply(this, args)
    }
    const callNow = immediate && !timeout
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
    if (callNow) func.apply(this, args)
  }
}

// Gestion des erreurs globales
window.addEventListener("error", (e) => {
  console.error("Erreur JavaScript:", e.error)
})

// Performance: Lazy loading des images
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  const lazyImages = document.querySelectorAll("img[data-src]")
  lazyImages.forEach((img) => imageObserver.observe(img))
}

// Accessibilité: Gestion du focus au clavier
document.addEventListener("keydown", (e) => {
  if (e.key === "Tab") {
    document.body.classList.add("keyboard-navigation")
  }
})

document.addEventListener("mousedown", () => {
  document.body.classList.remove("keyboard-navigation")
})
