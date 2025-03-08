document.addEventListener('DOMContentLoaded', () => {
    const images = [
        'https://i.pinimg.com/originals/ff/97/a5/ff97a55d677a79fd0c11585f6940d54f.jpg',
        'https://lwlies.com/wp-content/uploads/2017/11/John-Wick-2-900x0-c-default.jpg',
        'https://www.slashfilm.com/wp/wp-content/images/2017-bestposter-justiceleague.jpg',
        'https://th.bing.com/th/id/OIP.CiOSMSZiZnyqMOJOA2VqSAHaLG?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/OIP.INQI1AMDvD0fyEz1P_UYUgAAAA?rs=1&pid=ImgDetMain',
        'https://th.bing.com/th/id/R.00ce6cd881e1ceafb8a41ed7d3548d1d?rik=zlIwOI9NBPuIqA&riu=http%3a%2f%2fwww.impawards.com%2f2024%2fposters%2fbeekeeper_ver3.jpg&ehk=Syv4giI6%2fKXZQdCkm0vgQ3Kc7AFY41NF%2b2%2bZrZf7lf0%3d&risl=&pid=ImgRaw&r=0',
        'https://i.pinimg.com/originals/df/ab/ac/dfabacd37763b6e942261ec7ef0148de.jpg',
        'https://th.bing.com/th/id/OIP.19ZRs_U9noG1hJBRQyo-7AAAAA?rs=1&pid=ImgDetMain',
        'https://i.pinimg.com/originals/bd/57/c6/bd57c6c238273065b663f5830f0458b2.png'
    ];
    
    let currentIndex = 0;

    const imageElement = document.getElementById('slider-image');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    function showImage(index) {
        imageElement.style.transform = 'scale(0.8)';
        setTimeout(() => {
            imageElement.src = images[index];
            imageElement.style.transform = 'scale(1)';
        }, 200);
    }

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : images.length - 1;
        showImage(currentIndex);
    });

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex < images.length - 1) ? currentIndex + 1 : 0;
        showImage(currentIndex);
    });

    showImage(currentIndex);
});
