import { useParams } from 'react-router-dom';

import Layout from "@components/layout";
import "@styles/pages/ViewProfile.scss";

const ViewProfile = () => {

    const {userId} = useParams();


    return (
        <Layout protectedRoute={true}>
            <section className="viewProfile">
                <h1>This page has not been implemented yet...</h1>
                <article className='info'>
                    <p>Due to time constraints I don't plan on adding any more functionality to this route until I complete the Odin Project, if at all. There are alot of other things that I could add to this project as well as re-enginerring and cleaning up of the code base. This was the first time I have used scss and I am not exactly happy with how it turned out. If I did this project over again I would do it a little differently but I guess this is the process of learning and getting better. I hope if anyone comes across they at least think its decently done because I spent more time on this than I'd like to admit.</p>
                    <p>Thank you for reviewing this project.</p>
                </article>
            </section>
        </Layout>
    )
}

export default ViewProfile;