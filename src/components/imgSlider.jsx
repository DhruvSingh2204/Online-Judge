import React from 'react'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styled from 'styled-components';

function ImgSlider() {
    let settings = {
        dots: true,
        infinite: true,
        speed: 800,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
    };
    return (
        <Carousel {...settings}>
            <Wrap>
                <img src="https://media.istockphoto.com/id/1067941530/photo/practice-word-concept.jpg?s=612x612&w=0&k=20&c=m7nMh8hc9pPJcXO2snBPwLpYEJmdvjUC7zoj5PEVni8=" />
            </Wrap>

            <Wrap>
                <img src="https://media.licdn.com/dms/image/v2/C5112AQHe1B2tgaKTQQ/article-cover_image-shrink_720_1280/article-cover_image-shrink_720_1280/0/1558448319358?e=2147483647&v=beta&t=h1W0mtmHPG6p3HCXiV0L9bqrrkuuNLio2n-o4ED8L5Q" />
            </Wrap>

            <Wrap>
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRX8HcvU_b-9xkcTDFgwyPntuBBNFTa9s2d6Q&s" />
            </Wrap>

            <Wrap>
                <img src="https://www.freecodecamp.org/news/content/images/2023/03/binary-search-algorithm.png" />
            </Wrap>
        </Carousel>
    )
}

export default ImgSlider

const Carousel = styled(Slider)`
  /* margin-top: 20px; */
  overflow: hidden;

  .slick-list {
    /* overflow: hidden; */
  }

  ul li button {
    &:before {
      font-size: 10px;
      color: rgb(150 , 158 , 171);
    }
  }

  button {
    z-index: 1;
  }
`

const Wrap = styled.div`
  img {
    cursor: pointer;
    border: 4px solid transparent;
    height: 25%;
    width: 100%;
    border-radius: 10px;
    box-shadow: rgb(0 0 0 / 69%) 0px 26px 30px -10px ,
    rgb(0 0 0 / 73%) 0px 16px 10px -10px;
    transition-duration: 200ms;
    height: 40vh;

    &:hover {
      border: 4px solid white;
    }
  }
`