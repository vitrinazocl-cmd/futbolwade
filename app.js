document.addEventListener('DOMContentLoaded', () => {
  
  // 1. Inicializar iconos de Lucide
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Encabezado pegajoso (Sticky Header)
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // 3. Menú Móvil
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('nav a');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('active');
      
      // Alternar icono de menú (hamburguesa / cerrar)
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        const isMenu = icon.getAttribute('data-lucide') === 'menu';
        icon.setAttribute('data-lucide', isMenu ? 'x' : 'menu');
        lucide.createIcons();
      }
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      });
    });
  }

  // 4. Animación al hacer Scroll (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target); // Solo animar una vez
      }
    });
  }, observerOptions);

  revealElements.forEach(el => revealObserver.observe(el));

  // 5. Acordeón de Preguntas Frecuentes (FAQs)
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionButton = item.querySelector('.faq-question');
    questionButton.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Cerrar otros abiertos (opcional, estilo acordeón único)
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      // Alternar el actual
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 6. Validación del Formulario de Captación de Talentos
  const form = document.getElementById('talent-form');
  const formSuccess = document.getElementById('form-success');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const submitBtn = document.getElementById('submit-btn');

  // Elementos de los campos
  const fullnameInput = document.getElementById('fullname');
  const ageInput = document.getElementById('age');
  const positionInput = document.getElementById('position');
  const cityInput = document.getElementById('city');
  const phoneInput = document.getElementById('phone');
  const videoInput = document.getElementById('video');

  // Elementos del Drag & Drop File Upload
  const fileDropzone = document.getElementById('file-dropzone');
  const videoFileInput = document.getElementById('video-file');
  const fileUploadContent = document.getElementById('file-upload-content');
  const filePreview = document.getElementById('file-preview');
  const fileNameSpan = document.getElementById('file-name');
  const removeFileBtn = document.getElementById('remove-file-btn');

  let uploadedFile = null;

  // Lógica para Drag & Drop
  if (fileDropzone && videoFileInput) {
    // Evitar comportamientos por defecto
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
      fileDropzone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    // Efectos de arrastre
    ['dragenter', 'dragover'].forEach(eventName => {
      fileDropzone.addEventListener(eventName, () => {
        fileDropzone.classList.add('dragover');
      }, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
      fileDropzone.addEventListener(eventName, () => {
        fileDropzone.classList.remove('dragover');
      }, false);
    });

    // Manejar archivos caídos
    fileDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt.files;
      handleVideoFile(files[0]);
    }, false);

    // Manejar archivos seleccionados por el explorador
    videoFileInput.addEventListener('change', (e) => {
      handleVideoFile(e.target.files[0]);
    });

    // Quitar archivo cargado
    if (removeFileBtn) {
      removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Evitar abrir explorador al dar clic en cerrar
        clearUploadedFile();
      });
    }
  }

  function handleVideoFile(file) {
    if (!file) return;

    const fileGroup = fileDropzone.closest('.form-group');
    const maxSize = 50 * 1024 * 1024; // 50MB

    // Validar tipo de archivo (debe ser video) y tamaño
    if (file.type.startsWith('video/') && file.size <= maxSize) {
      uploadedFile = file;
      fileGroup.classList.remove('has-error');
      
      // Mostrar vista previa en la UI
      fileNameSpan.textContent = `${file.name} (${(file.size / (1024 * 1024)).toFixed(1)} MB)`;
      fileUploadContent.style.display = 'none';
      filePreview.style.display = 'flex';
      
      // Re-inicializar iconos Lucide en el elemento
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
    } else {
      clearUploadedFile();
      fileGroup.classList.add('has-error');
    }
  }

  function clearUploadedFile() {
    uploadedFile = null;
    videoFileInput.value = '';
    fileUploadContent.style.display = 'flex';
    filePreview.style.display = 'none';
  }

  // Función para validar un grupo de formulario individual
  function validateField(inputElement, validationFn) {
    const formGroup = inputElement.closest('.form-group');
    const isValid = validationFn(inputElement.value.trim());

    if (isValid) {
      formGroup.classList.remove('has-error');
      return true;
    } else {
      formGroup.classList.add('has-error');
      return false;
    }
  }

  // Reglas de validación
  const validationRules = {
    fullname: (val) => val.length >= 4,
    age: (val) => {
      const num = parseInt(val, 10);
      return !isNaN(num) && num >= 12 && num <= 25;
    },
    position: (val) => val !== '',
    city: (val) => val.length > 0,
    phone: (val) => /^[0-9]{9}$/.test(val),
    video: (val) => {
      if (val === '') return true; // Opcional
      try {
        new URL(val);
        return true;
      } catch (_) {
        return false;
      }
    }
  };

  // Agregar eventos de escucha en tiempo real para limpiar errores al corregir
  fullnameInput.addEventListener('input', () => validateField(fullnameInput, validationRules.fullname));
  ageInput.addEventListener('input', () => validateField(ageInput, validationRules.age));
  positionInput.addEventListener('change', () => validateField(positionInput, validationRules.position));
  cityInput.addEventListener('input', () => validateField(cityInput, validationRules.city));
  phoneInput.addEventListener('input', () => validateField(phoneInput, validationRules.phone));
  videoInput.addEventListener('input', () => validateField(videoInput, validationRules.video));

  // Manejador del submit del formulario
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Validar todos los campos antes de enviar
      const isNameValid = validateField(fullnameInput, validationRules.fullname);
      const isAgeValid = validateField(ageInput, validationRules.age);
      const isPositionValid = validateField(positionInput, validationRules.position);
      const isCityValid = validateField(cityInput, validationRules.city);
      const isPhoneValid = validateField(phoneInput, validationRules.phone);
      const isVideoValid = validateField(videoInput, validationRules.video);

      const isFormValid = isNameValid && isAgeValid && isPositionValid && isCityValid && isPhoneValid && isVideoValid;

      if (isFormValid) {
        // Estado de carga en el botón
        const originalBtnHTML = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span>Enviando Datos...</span>
          <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="animation: spin 1s linear infinite; margin-left: 8px;">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" style="opacity: 0.25;"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        `;

        // Añadir animación keyframe de spin si no está en el CSS
        if (!document.getElementById('spin-keyframes')) {
          const style = document.createElement('style');
          style.id = 'spin-keyframes';
          style.textContent = `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `;
          document.head.appendChild(style);
        }

        // Simular envío de datos a base de datos / correo (1.5 segundos)
        setTimeout(() => {
          // Mostrar overlay de éxito
          formSuccess.classList.add('active');
          
          // Reestablecer el botón de envío
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnHTML;
        }, 1500);
      } else {
        // Hacer scroll sutil al primer elemento con error
        const firstError = form.querySelector('.has-error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    });
  }

  // Restablecer formulario e ir a nueva postulación
  if (resetFormBtn) {
    resetFormBtn.addEventListener('click', () => {
      form.reset();
      clearUploadedFile();
      
      // Limpiar clases de error
      const formGroups = form.querySelectorAll('.form-group');
      formGroups.forEach(group => group.classList.remove('has-error'));
      
      // Ocultar pantalla de éxito
      formSuccess.classList.remove('active');
    });
  }

  // 7. Lógica del Carrusel de Leyendas
  const carouselTrack = document.getElementById('carousel-track');
  const carouselSlides = Array.from(document.querySelectorAll('.carousel-slide'));
  const carouselPrevBtn = document.getElementById('carousel-prev');
  const carouselNextBtn = document.getElementById('carousel-next');
  const carouselIndicators = Array.from(document.querySelectorAll('.carousel-indicators .indicator'));

  let currentSlideIndex = 0;
  const totalSlides = carouselSlides.length;

  function updateCarousel(index) {
    if (index < 0) {
      currentSlideIndex = totalSlides - 1;
    } else if (index >= totalSlides) {
      currentSlideIndex = 0;
    } else {
      currentSlideIndex = index;
    }

    // Mover el track
    const amountToMove = -currentSlideIndex * 33.3333; // Mover 33.3333% por slide
    carouselTrack.style.transform = `translateX(${amountToMove}%)`;

    // Cambiar clases de slide activo
    carouselSlides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // Cambiar clase de indicador activo
    carouselIndicators.forEach((indicator, i) => {
      if (i === currentSlideIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  if (carouselTrack && carouselSlides.length > 0) {
    // Controladores de botones
    carouselPrevBtn.addEventListener('click', () => {
      updateCarousel(currentSlideIndex - 1);
    });

    carouselNextBtn.addEventListener('click', () => {
      updateCarousel(currentSlideIndex + 1);
    });

    // Controladores de indicadores
    carouselIndicators.forEach(indicator => {
      indicator.addEventListener('click', (e) => {
        const slideIndex = parseInt(e.target.getAttribute('data-slide'), 10);
        updateCarousel(slideIndex);
      });
    });
  }

  // 8. Lógica del Buscador Global e Inteligente
  const globalSearchInput = document.getElementById('global-search');
  const searchBtnTrigger = document.getElementById('search-btn-trigger');
  const searchFeedbackPanel = document.getElementById('search-results-feedback');

  function performSearch() {
    if (!globalSearchInput) return;
    
    const query = globalSearchInput.value.trim().toLowerCase();
    
    // Limpiar resaltado previo
    removeHighlights();

    if (query === '') {
      if (searchFeedbackPanel) {
        searchFeedbackPanel.style.display = 'none';
      }
      resetSearchVisibility();
      return;
    }

    // Elementos a buscar
    const faqElements = document.querySelectorAll('.faq-item');
    const processElements = document.querySelectorAll('.process-card');
    const benefitElements = document.querySelectorAll('.benefit-item');

    let totalMatches = 0;
    let firstMatchElement = null;

    // Buscar en FAQs
    faqElements.forEach(item => {
      const questionText = item.querySelector('.faq-question span').textContent.toLowerCase();
      const answerText = item.querySelector('.faq-answer-content').textContent.toLowerCase();
      
      if (questionText.includes(query) || answerText.includes(query)) {
        totalMatches++;
        item.style.borderColor = 'var(--primary)';
        item.style.boxShadow = 'var(--shadow-neon)';
        
        // Abrir el FAQ que coincide
        item.classList.add('active');
        
        // Resaltar la pregunta
        highlightText(item.querySelector('.faq-question span'), query);
        highlightText(item.querySelector('.faq-answer-content'), query);

        if (!firstMatchElement) {
          firstMatchElement = item;
        }
      } else {
        item.classList.remove('active');
        item.style.borderColor = '';
        item.style.boxShadow = '';
      }
    });

    // Buscar en el Proceso
    processElements.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const desc = card.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(query) || desc.includes(query)) {
        totalMatches++;
        card.style.borderColor = 'var(--primary)';
        card.style.boxShadow = 'var(--shadow-neon)';
        
        highlightText(card.querySelector('h3'), query);
        highlightText(card.querySelector('p'), query);

        if (!firstMatchElement) {
          firstMatchElement = card;
        }
      } else {
        card.style.borderColor = '';
        card.style.boxShadow = '';
      }
    });

    // Buscar en Beneficios
    benefitElements.forEach(item => {
      const title = item.querySelector('h4').textContent.toLowerCase();
      const desc = item.querySelector('p').textContent.toLowerCase();
      
      if (title.includes(query) || desc.includes(query)) {
        totalMatches++;
        item.style.border = '1px solid var(--border-neon)';
        item.style.padding = '10px';
        item.style.borderRadius = '8px';
        item.style.backgroundColor = 'rgba(0, 229, 255, 0.02)';
        
        highlightText(item.querySelector('h4'), query);
        highlightText(item.querySelector('p'), query);

        if (!firstMatchElement) {
          firstMatchElement = item;
        }
      } else {
        item.style.border = '';
        item.style.padding = '';
        item.style.borderRadius = '';
        item.style.backgroundColor = '';
      }
    });

    // Mostrar feedback de búsqueda
    if (searchFeedbackPanel) {
      searchFeedbackPanel.style.display = 'block';
      if (totalMatches > 0) {
        searchFeedbackPanel.innerHTML = `Se encontraron <strong>${totalMatches}</strong> coincidencias. Se han resaltado en color azul neón.`;
        searchFeedbackPanel.style.color = 'var(--primary)';
        searchFeedbackPanel.style.backgroundColor = 'rgba(0, 229, 255, 0.05)';
        searchFeedbackPanel.style.borderColor = 'var(--border-neon)';
        
        // Scroll suave al primer elemento coincidente
        if (firstMatchElement) {
          firstMatchElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      } else {
        searchFeedbackPanel.innerHTML = `No se encontraron resultados para "<strong>${globalSearchInput.value}</strong>". Intenta buscar palabras clave como 'edad', 'costo', 'delantero' o 'contacto'.`;
        searchFeedbackPanel.style.color = 'var(--accent-error)';
        searchFeedbackPanel.style.backgroundColor = 'rgba(255, 23, 68, 0.05)';
        searchFeedbackPanel.style.borderColor = 'rgba(255, 23, 68, 0.2)';
      }
    }
  }

  function highlightText(element, query) {
    const textContent = element.textContent;
    const index = textContent.toLowerCase().indexOf(query);
    if (index >= 0) {
      element.innerHTML = textContent.replace(new RegExp(query, 'gi'), match => `<span class="search-highlight">${match}</span>`);
    }
  }

  function removeHighlights() {
    const highlights = document.querySelectorAll('.search-highlight');
    highlights.forEach(span => {
      const parent = span.parentNode;
      parent.replaceChild(document.createTextNode(span.textContent), span);
      parent.normalize();
    });
  }

  function resetSearchVisibility() {
    const faqElements = document.querySelectorAll('.faq-item');
    const processElements = document.querySelectorAll('.process-card');
    const benefitElements = document.querySelectorAll('.benefit-item');

    faqElements.forEach(item => {
      item.style.borderColor = '';
      item.style.boxShadow = '';
      item.classList.remove('active');
    });

    processElements.forEach(card => {
      card.style.borderColor = '';
      card.style.boxShadow = '';
    });

    benefitElements.forEach(item => {
      item.style.border = '';
      item.style.padding = '';
      item.style.borderRadius = '';
      item.style.backgroundColor = '';
    });
  }

  // Eventos de búsqueda
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', performSearch);
    
    if (searchBtnTrigger) {
      searchBtnTrigger.addEventListener('click', performSearch);
    }
  }

});
