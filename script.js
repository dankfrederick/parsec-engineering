'use strict';

// Selecting elements

// General Elements
const nav = document.querySelector('.nav');
const navHeight = nav.getBoundingClientRect().height;
const header = document.querySelector('.header');

// Modal Elements
const modal__contact = document.querySelector('.modal__contact');
const modal__hosting = document.querySelector('.modal__hosting');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelectorAll('.btn--close-modal');
const btnsContactOpenModal = document.querySelectorAll('.btn--contact-modal');
const btnsHostingOpenModal = document.querySelector('.btn--hosting-modal');
const btnSendRequest = document.querySelector('.btn--send-request');

// Email JS initialization
// https://dashboard.emailjs.com/admin/account
emailjs.init({publicKey: "-3jgBtxzfR1-HYlpu"});

///////////////////////////////////////
// Smooth scrolling

// Not used because this creates an event listener for each element, which is not efficient
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     e.preventDefault();
  
//     const id = this.getAttribute('href');
//     console.log(id);
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

// // Smooth scrolling through event delegation, one event listener on the parent element and then determine what element originated the event
// document.querySelector('.nav__links').addEventListener('click', function (e) {
//   e.preventDefault();
  
//   // Matching strategy
//   if (e.target.classList.contains('nav__link')) {
//     const id = e.target.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   }
// });

// Smooth scrolling through event delegation, one event listener on the parent element and then determine what element originated the event
document.querySelector('.nav__links').addEventListener('click', function (e) {
  e.preventDefault();
  
// Matching strategy
  if (e.target.classList.contains('nav__link')) {
    const id = e.target.getAttribute('href');

    // Calculate the position of the target element with offset for sticky header (ternary operator to account for inital offset of 0 when the page is loaded and the header is not sticky yet)
    const offsetPosition = document.querySelector(id).getBoundingClientRect().top - document.body.getBoundingClientRect().top - (document.body.getBoundingClientRect().top? navHeight : 2 * navHeight);

    // Scroll to the target element
    window.scrollTo({top: offsetPosition,
      behavior: 'smooth'});
  }
});

///////////////////////////////////////
// Sticky navigation

// Callback function to add or remove sticky class
const stickyNav = function (entries) {
  const [entry] = entries;
  
  if (!entry.isIntersecting) {
    nav.classList.add('sticky');
  } else {
    nav.classList.remove('sticky');
  }
}

// Options for the observer
const obsOptions = {
  root: null,
  threshold: 0.5,
  rootMargin: `${2*navHeight}px`
};

// Create the observer
const obeserver = new IntersectionObserver(stickyNav, obsOptions);
obeserver.observe(header);

///////////////////////////////////////
// Lazy loading images, load high resolution images after the rest of the page is loaded

// Select all images with the lazy-img class
const imgTargets = document.querySelectorAll('img[data-src]');

// Callback function to load the high resolution image
const loadImg = function (entry) {

  // Replace src with data-src
  entry.src = entry.dataset.src;
  
  // Remove lazy-img class after the image is loaded
  entry.addEventListener('load', function () {
    entry.classList.remove('lazy-img');
  });
};

// Trigger loading of high resolution images after the rest of the page is loaded
window.addEventListener('load', function (e) {
  imgTargets.forEach(img => loadImg(img));
});

///////////////////////////////////////
// Modal windows

// Contact modal
const openModal = function (e) {
  e.preventDefault();
  modal__hosting.classList.add('hidden');
  modal__contact.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal__contact.classList.add('hidden');
  modal__hosting.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsContactOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.forEach(btn => btn.addEventListener('click', closeModal));
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//Function to send contact email
const sendContact = function (e) {
  e.preventDefault();

  btnSendRequest.innerHTML = 'Sending...';

  emailjs.send('service_5v64wrh', 'template_iom9j7q', {
  from_name: "dan@parsecengineering.com",
  user_name: document.getElementById('name').value,
  user_email: document.getElementById('email').value,
  user_number: document.getElementById('phone').value,
  message: document.getElementById('message').value
  })
  .then(() => {
    btnSendRequest.innerHTML = 'Sent!';
      alert('Sent!');
      btnSendRequest.removeEventListener('click', sendContact);
  }, (error) => {
    console.log('FAILED...', error);
    btnSendRequest.innerHTML = 'Email Failed';
      alert(JSON.stringify(err));
  });
};

// Event listener for the send request button
btnSendRequest.addEventListener('click', sendContact);

// Hosting modal
const openHostingModal = function (e) {
  e.preventDefault();
  modal__hosting.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

btnsHostingOpenModal.addEventListener('click', openHostingModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeHostingModal();
  }
});