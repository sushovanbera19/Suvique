import BannerSlider from './BannerSlider'
import BlogSlider from './BlogSlider'
import Collections from './Collections'
import FeaturedProducts from './FeaturedProducts'
import BeInspired from './inspired'
import Catagory from './productcategory'
import VideoSlider from './VideoSlider'

// MISSING COMPONENTS
import ReviewSlider from '../Common/ReviewSlider'
import NewsletterSubscribe from '../Common/NewsletterSubscribe'
import FurnitureGallery from '../Common/FurnitureGallery'

const Home = () => {
  return (
    <div>
      <BannerSlider />
      <Catagory />
      <FeaturedProducts />
      <BeInspired />
      <Collections />
      <VideoSlider />
      <BlogSlider />
      <ReviewSlider />
      
   </div>
  );
};

export default Home;