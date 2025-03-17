import Layout from "layouts/user";
import HeroSection from 'views/user/common/hero';
import { BlogSection } from 'views/user/common/blog';

export default function HomePage(){
    return(
        <Layout>
            <HeroSection/>
            <BlogSection/>
        </Layout>
    )
}
