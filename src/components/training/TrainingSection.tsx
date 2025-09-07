import Pagination from "../shared/Pagination";
import TrainingCard from "./TrainingCard";

export default function TrainingSection() {
   return(
     <section className="py-8">
        <div className="container mx-auto px-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* <!-- Training 1 --> */}
                {[12, 3213, 1, 3, 123, 21].map((item, i) => (
                    <TrainingCard key={i} />
                ))}
            </div>

            {/* <!-- Pagination --> */}
           {/* <Pagination/> */}
        </div>
    </section>
   )
}