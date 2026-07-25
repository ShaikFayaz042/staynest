import Footer from "../components/common/Footer";
import Navbar from "../components/common/Navbar";
import CategoryBar from "../components/home/CategoryBar";
import ListingGrid from "../components/home/ListingGrid";

export default function HomePage() {
  return (
    <div className="min-h-screen min-w-screen  mx-auto px-6 lg:px-10">
      <Navbar></Navbar>
      <CategoryBar></CategoryBar>
      <ListingGrid></ListingGrid>
      <Footer></Footer>
    </div>
  );
}
