
const fileUploadInput = document.getElementById('file-upload');
const fileNameDisplay = document.getElementById('file-name');


fileUploadInput.addEventListener('change', function() {

    const file = fileUploadInput.files[0];

    if (file) {
       
        fileNameDisplay.textContent = `Selected File: ${file.name}`;
    } else {
       
        fileNameDisplay.textContent = 'No file selected';
    }
});


document.getElementById('report-form').addEventListener('submit', function(e) {
    e.preventDefault(); 
    const file = fileUploadInput.files[0];
    if (!file) {
        alert('Please select a PDF file before submitting.');
        return;
    }

    alert(`File "${file.name}" uploaded successfully!`);
});
