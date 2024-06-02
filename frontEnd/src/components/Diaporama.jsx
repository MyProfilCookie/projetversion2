// export default Diaporama
/* eslint-disable no-unused-vars */
import React from 'react';
import { useRef, useState } from 'react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import img from '/images/muffin/muffinmyrtille.webp';
import img2 from '/images/gourmandise/eclairs.webp';
import img3 from '/images/gourmandise/cakefruits.webp';
import img4 from '/images/tartecitron/tartelettesframboises.webp';
import img5 from '/images/tartecitron/tartemeringue.jpeg';
import img6 from '/images/viennoiserie/croissant.webp';
import img7 from '/images/viennoiserie/painauraisin.webp';
import img8 from '/images/viennoiserie/macaronsamandes.webp';
import img9 from '/images/viennoiserie/chaussonauxpommes.webp';


// Import Swiper styles
import 'swiper/scss';
import 'swiper/scss/navigation';
import 'swiper/scss/pagination';
import 'swiper/scss/scrollbar';

function Diaporama() {
    
 
    return (
        <Swiper
        autoplay={true}
        pagination={true}
        navigation={true}
        modules={[EffectCoverflow, Pagination, Autoplay, Navigation]}
        
        breakpoints={{
            640: {
                slidesPerView: 1,
                spaceBetween: 10,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 10,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 10,
            },
        }}
        className="mySwiper section-container"
        
       
      >
            <SwiperSlide><img src={img} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img2} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img3} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img4} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img5} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img6} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img7} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img8} className='img-diaporama' /></SwiperSlide>
            <SwiperSlide><img src={img9} className='img-diaporama' /></SwiperSlide>
        </Swiper>
    );
}

export default Diaporama