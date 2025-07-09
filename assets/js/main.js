document.addEventListener("DOMContentLoaded", () => {
   
   const loadComponent = (selector, url) => {
       fetch(url)
           .then(response => {
               if (!response.ok) {
                   throw new Error(`Error de red al cargar ${url}. Estado: ${response.status}. Asegúrate de usar Live Server y que la ruta del archivo es correcta.`);
               }
               return response.text();
           })
           .then(html => {
               const container = document.querySelector(selector);
               if (container) {
                   container.innerHTML = html;
                   
                   // Ejecutar scripts del HTML cargado
                   const scripts = container.querySelectorAll('script');
                   scripts.forEach(script => {
                       const newScript = document.createElement('script');
                       if (script.src) {
                           newScript.src = script.src;
                       } else {
                           newScript.textContent = script.textContent;
                       }
                       document.head.appendChild(newScript);
                   });
               }
               
               // Inicializar funcionalidades específicas de personas
               initializeMenu();
               initializeAquiPuedoMenu();
               initializeTabs();
           })
           .catch(error => {
               console.error(error);
               const container = document.querySelector(selector);
               if (container) {
                   container.innerHTML = `<p style="text-align:center; color:red; padding: 1rem;">Error al cargar el header. Revisa la consola (F12).</p>`;
               }
               
               // Inicializar funcionalidades aunque falle el header
               initializeMenu();
               initializeTabs();
           });
   };

   // Solo cargar header si existe el contenedor (páginas de personas)
   const headerContainer = document.querySelector("#header-container");
   if (headerContainer) {
       loadComponent("#header-container", "../componentes/header.html");
   } else {
       // Si no hay header-container, inicializar directamente
       initializeMenu();
       initializeTabs();
   }

   function initializeMenu() {
       // --- Lógica de Menú Activo para páginas de PERSONAS ---
       const menuLinks = document.querySelectorAll('.floating-menu-item');
       const sections = document.querySelectorAll('.scroll-section');
       const mainContainer = document.querySelector('main.sections-container');

       // Solo ejecutar si estamos en una página de personas
       if (!mainContainer || menuLinks.length === 0 || sections.length === 0) {
           console.log('No se encontraron elementos del menú de personas o no estamos en página de personas');
           return;
       }

       // 1. Scroll suave al hacer clic en el menú
       menuLinks.forEach(link => {
           link.addEventListener('click', (e) => {
               e.preventDefault();
               const targetId = link.getAttribute('data-target');
               const targetSection = document.getElementById(targetId);

               if (targetSection) {
                   // Usar scrollIntoView que es más confiable
                   targetSection.scrollIntoView({
                       behavior: 'smooth',
                       block: 'start'
                   });
               }
           });
       });

       // 2. Resaltar el botón del menú según la sección visible
       const observerOptions = {
           root: null, // Usar null para observar contra el viewport
           rootMargin: '0px',
           threshold: 0.5
       };

       const observer = new IntersectionObserver((entries) => {
           entries.forEach(entry => {
               if (entry.isIntersecting) {
                   const targetId = entry.target.id;
                   
                   // Remover clase active de todos los enlaces
                   menuLinks.forEach(link => {
                       link.classList.remove('active');
                   });
                   
                   // Agregar clase active al enlace correspondiente
                   const activeLink = document.querySelector(`[data-target="${targetId}"]`);
                   if (activeLink) {
                       activeLink.classList.add('active');
                   }
               }
           });
       }, observerOptions);

       sections.forEach(section => {
           observer.observe(section);
       });

       console.log('Menú de personas inicializado correctamente');
   }

   function initializeAquiPuedoMenu() {
       // Función para manejar el menú "Aquí puedo" - SOLO PERSONAS
       // Se ejecutará cuando el header se haya cargado
       setTimeout(() => {
           const aquiPuedoBtn = document.getElementById('aqui-puedo-btn');
           const aquiPuedoMenu = document.getElementById('aqui-puedo-menu');
           const menuOverlay = document.getElementById('menu-overlay');

           if (aquiPuedoBtn && aquiPuedoMenu && menuOverlay) {
               aquiPuedoBtn.addEventListener('click', function(e) {
                   e.preventDefault();
                   aquiPuedoMenu.classList.toggle('active');
                   menuOverlay.classList.toggle('active');
                   aquiPuedoBtn.classList.toggle('active');
               });

               menuOverlay.addEventListener('click', function() {
                   aquiPuedoMenu.classList.remove('active');
                   menuOverlay.classList.remove('active');
                   aquiPuedoBtn.classList.remove('active');
               });

               // Cerrar con tecla Escape
               document.addEventListener('keydown', function(e) {
                   if (e.key === 'Escape') {
                       aquiPuedoMenu.classList.remove('active');
                       menuOverlay.classList.remove('active');
                       aquiPuedoBtn.classList.remove('active');
                   }
               });

               console.log('Menú "Aquí puedo" inicializado correctamente');
           } else {
               console.log('No se encontraron elementos del menú "Aquí puedo" (normal en páginas de empresas)');
           }
       }, 100);
   }

   function initializeTabs() {
       // Función para manejar los tabs de páginas de productos (Mi comercio, etc.)
       const tabButtons = document.querySelectorAll('.tab-button');
       const tabPanels = document.querySelectorAll('.tab-panel');

       if (tabButtons.length > 0 && tabPanels.length > 0) {
           tabButtons.forEach(button => {
               button.addEventListener('click', function() {
                   // Remover clase active de todos los botones y paneles
                   tabButtons.forEach(btn => btn.classList.remove('active'));
                   tabPanels.forEach(panel => panel.classList.remove('active'));

                   // Agregar clase active al botón clickeado
                   button.classList.add('active');

                   // Mostrar el panel correspondiente
                   const targetTab = button.getAttribute('data-tab');
                   const targetPanel = document.getElementById(targetTab);
                   if (targetPanel) {
                       targetPanel.classList.add('active');
                   }
               });
           });
           console.log('Tabs de productos inicializados correctamente');
       }
   }

});