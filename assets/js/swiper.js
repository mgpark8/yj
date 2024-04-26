// index.html 스와이퍼
const swiper = new Swiper(".mySwiper", {
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
        renderBullet: function (index, className) {
            return `
                <div class="${className}">
                    <span data-time=${index} class="time-length"></span>
                </div>
            `;
        },
    },
    effect: 'fade',
    // loop: true,
    autoplay: {
        delay: 9000, // 동영상 길이
    },
    on: {
        slideChange: function () {
            const videos = document.querySelectorAll('video');
            const swiperIndex = this.activeIndex;
            videos[swiperIndex].load();

            if (this.isEnd) {
                setTimeout(function () {
                    swiper.slideTo(0);
                }, 9000); // 동영상 길이
            }
        },
    },
});

const mBannerSwiper = new Swiper('.mBannerSwiper', {
    loop: true,
    direction: 'horizontal',
    pagination: {
        el: '.swiper-pagination',
        clickable: true
    },
    slidesPerView: 1.2,
    spaceBetween: 24,
    breakpoints: {
        768: {
            slidesPerView:2.2,
            spaceBetween: 40,
        }
    }
})


// 솔루션 swiper
let image = [];
let swiperQtt = document.querySelectorAll('.mySwiper2 .swiper-slide');
let names = ['erp', 'pos', 'oms', 'wms', 'scm', 'promotion', 'rpa', 'accounting', 'dbms', 'e-shop', 'analyze', 'platform']
names.forEach((e) => {
    let swiperTarget = document.querySelector(`.mySwiper2.${e}`);
    if (swiperTarget) {
        for (let i = 0; i < swiperQtt.length; i++) {
            image.push(`${e}_${i + 1}.png`)
        }
        const swiper2 = new Swiper(swiperTarget, {
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
                bulletClass: "custom_bullet",
                bulletActiveClass: "swiper-pagination-custom-bullet-active",
                renderBullet: function (index, className) {

                    return `
                        <div class="${className}">
                            <img src="../assets/img/${image[index]}">
                        </div>
                    `;
                },
            },
            effect: 'fade',
        })
        const textPagiList = document.querySelectorAll('.text-pagi li');
        swiper2.on('slideChange', function () {
            textPagiList.forEach((e, idx) => {
                e.classList.remove('active');
            })
            textPagiList[swiper2.activeIndex].classList.add('active');
        });
        textPagiList.forEach((e, idx) => {
            e.addEventListener('click', () => {
                swiper2.slideTo(idx);
            })
        })
    }
})





