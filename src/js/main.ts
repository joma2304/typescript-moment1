// Interface för kursinformation
interface CourseInfo {
    code: string;
    name: string;
    progression: 'A' | 'B' | 'C';
    syllabus: string;
}

// Lägg till en kurs när knappen klickas
document.getElementById('addCourseBtn')?.addEventListener('click', function () {
    const codeInput = document.getElementById('code') as HTMLInputElement;
    const nameInput = document.getElementById('name') as HTMLInputElement;
    const progressionInput = document.getElementById('progression') as HTMLSelectElement;
    const syllabusInput = document.getElementById('syllabus') as HTMLInputElement;

    const code = codeInput.value.trim();
    const name = nameInput.value.trim();
    const progression = progressionInput.value as 'A' | 'B' | 'C'; // Värdet är antingen 'A', 'B' eller 'C'
    const syllabus = syllabusInput.value.trim();

    if (!validateCourseCode(code)) {
        alert('Ogiltig kurskod. Kurskoden måste vara unik.');
        return;
    }

    const course: CourseInfo = { code, name, progression, syllabus };
    addCourse(course);
    displayCourseList(); // Uppdatera listan med kurser efter att en ny kurs har lagts till

        // Rensa inputfälten
        codeInput.value = '';
        nameInput.value = '';
        progressionInput.value = 'A'; // Återställ till A
        syllabusInput.value = '';
});

// Funktion för att spara kursen i localStorage
function addCourse(course: CourseInfo) {
    localStorage.setItem(course.code, JSON.stringify(course));
}

// Funktion för att visa en lista över befintliga kurser
function displayCourseList() {
    const courseList = document.getElementById('courseList');
    if (!courseList) return;

    courseList.innerHTML = '';

    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key) continue;

        const courseJson = localStorage.getItem(key);
        if (!courseJson) continue;

        const course: CourseInfo = JSON.parse(courseJson);

        const listItem = document.createElement('ul');
        listItem.innerHTML = `
            <li>Kurskod: ${course.code}</li>
            <li>Kursnamn: ${course.name}</li>
            <li>Progression: ${course.progression}</li>
            <li>URL: <a href="${course.syllabus}" target="_blank">${course.syllabus}</a></li>`;

        // Skapa knappar för att ta bort och uppdatera kurser
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Ta bort';
        deleteButton.classList.add('delete-button');
        deleteButton.addEventListener('click', function () {
            removeCourse(course.code);
            displayCourseList(); // Uppdatera listan med kurser efter att en kurs har tagits bort
        });

        const updateButton = document.createElement('button');
        updateButton.textContent = 'Ändra';
        updateButton.classList.add('update-button');
        updateButton.addEventListener('click', function () {
            showModalToUpdateCourse(course);
        });

        listItem.appendChild(deleteButton);
        listItem.appendChild(updateButton);

        courseList.appendChild(listItem);
    }
}

// Visa lista över kurser när sidan laddas
window.addEventListener('load', function () {
    displayCourseList();
});

// Funktion för att visa modalen för att uppdatera en kurs
function showModalToUpdateCourse(course: CourseInfo) {
    // Visa modalen för att uppdatera kursen
    const modal = document.getElementById('updateCourseModal');
    if (!modal) return;

    // Hämta stängningsknappen
    const closeButton = document.querySelector('.close') as HTMLElement;
    // Lägg till en händelselyssnare för klick på stängningsknappen
    if (closeButton) {
        closeButton.addEventListener('click', function() {
            modal.style.display = 'none'; // Dölj modalen när användaren klickar på stängningsknappen
        });
    }

    // Fyll modalen med aktuell kursinformation
    const codeInput = document.getElementById('updateCode') as HTMLInputElement;
    const nameInput = document.getElementById('updateName') as HTMLInputElement;
    const progressionInput = document.getElementById('updateProgression') as HTMLSelectElement;
    const syllabusInput = document.getElementById('updateSyllabus') as HTMLInputElement;

    codeInput.value = course.code;
    nameInput.value = course.name;
    progressionInput.value = course.progression;
    syllabusInput.value = course.syllabus;

    // Lyssna på klick för uppdateringsknappen i modalen
    const updateBtn = document.getElementById('updateCourseBtn');
    if (!updateBtn) return;

    updateBtn.addEventListener('click', function () {
        const updatedCode = codeInput.value.trim();
        const updatedName = nameInput.value.trim();
        const updatedProgression = progressionInput.value as 'A' | 'B' | 'C';
        const updatedSyllabus = syllabusInput.value.trim();

        // Uppdatera kursen i localStorage
        const updatedCourse: CourseInfo = { code: updatedCode, name: updatedName, progression: updatedProgression, syllabus: updatedSyllabus };
        updateCourse(course.code, updatedCourse);

        // Stäng modalen
        modal.style.display = 'none';

        // Uppdatera kurslistan på sidan
        displayCourseList();
    });

    // Visa modalen
    modal.style.display = 'block';
}

// Funktion för att uppdatera kursen i localStorage
function updateCourse(code: string, updatedCourse: CourseInfo) {
    localStorage.setItem(code, JSON.stringify(updatedCourse));
}

// Funktion för att ta bort en kurs
function removeCourse(courseCode: string) {
    // Kontrollera om kursen finns i localStorage
    if (localStorage.getItem(courseCode)) { 
        // Försök ta bort kursen från localStorage
        localStorage.removeItem(courseCode); 
        // Uppdatera listan med kurser
        displayCourseList();
    } else {
        console.error(`Kursen med kod ${courseCode} hittades inte i localStorage.`);
    }
}

// Validera kurskoden för att kolla så att den är unik
function validateCourseCode(code: string): boolean {
    return localStorage.getItem(code) === null; //Returnerar true om koden inte finns sparad i localstorage
}


