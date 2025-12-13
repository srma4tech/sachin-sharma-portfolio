// Smooth scrolling for navigation links
document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Highlight active nav link
const navLinks = document.querySelectorAll('nav a');
const sections = document.querySelectorAll('section');

const observerOptions = {
    rootMargin: '-80px 0px -80px 0px',
    threshold: 0
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Optional: Add some animation on scroll
const sectionsAnim = document.querySelectorAll('section');

const animObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

sectionsAnim.forEach(section => {
    section.style.opacity = 0;
    section.style.transform = 'translateY(20px)';
    section.style.transition = 'opacity 0.5s, transform 0.5s';
    animObserver.observe(section);
});

// Back to top functionality
document.querySelector('.back-to-top').addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Form validation
const form = document.querySelector('form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject');
const messageInput = document.getElementById('message');

const nameError = document.getElementById('name-error');
const emailError = document.getElementById('email-error');
const subjectError = document.getElementById('subject-error');
const messageError = document.getElementById('message-error');

function validateName() {
    const name = nameInput.value.trim();
    if (name.length < 2) {
        nameInput.classList.add('invalid');
        nameInput.classList.remove('valid');
        nameError.textContent = 'Name must be at least 2 characters.';
        return false;
    } else {
        nameInput.classList.remove('invalid');
        nameInput.classList.add('valid');
        nameError.textContent = '';
        return true;
    }
}

function validateEmail() {
    const email = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        emailInput.classList.add('invalid');
        emailInput.classList.remove('valid');
        emailError.textContent = 'Please enter a valid email address.';
        return false;
    } else {
        emailInput.classList.remove('invalid');
        emailInput.classList.add('valid');
        emailError.textContent = '';
        return true;
    }
}

function validateSubject() {
    const subject = subjectInput.value.trim();
    if (subject.length < 5) {
        subjectInput.classList.add('invalid');
        subjectInput.classList.remove('valid');
        subjectError.textContent = 'Subject must be at least 5 characters.';
        return false;
    } else {
        subjectInput.classList.remove('invalid');
        subjectInput.classList.add('valid');
        subjectError.textContent = '';
        return true;
    }
}

function validateMessage() {
    const message = messageInput.value.trim();
    if (message.length < 10) {
        messageInput.classList.add('invalid');
        messageInput.classList.remove('valid');
        messageError.textContent = 'Message must be at least 10 characters.';
        return false;
    } else {
        messageInput.classList.remove('invalid');
        messageInput.classList.add('valid');
        messageError.textContent = '';
        return true;
    }
}

nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
subjectInput.addEventListener('blur', validateSubject);
messageInput.addEventListener('blur', validateMessage);

// Reset button functionality
document.querySelector('button[type="reset"]').addEventListener('click', () => {
    // Clear validation states
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    [nameError, emailError, subjectError, messageError].forEach(error => {
        error.textContent = '';
    });
});

form.addEventListener('submit', (e) => {
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isSubjectValid = validateSubject();
    const isMessageValid = validateMessage();

    if (!isNameValid || !isEmailValid || !isSubjectValid || !isMessageValid) {
        e.preventDefault();
        alert('Please correct the errors in the form.');
        return;
    }

    // Reset form fields
    form.reset();
    // Clear validation states
    [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
        input.classList.remove('valid', 'invalid');
    });
    [nameError, emailError, subjectError, messageError].forEach(error => {
        error.textContent = '';
    });

    alert('Thank you for your message! Your email client has been opened to send the message.');
});