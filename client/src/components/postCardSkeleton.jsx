import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css" 

import "@styles/components/postCard.scss";

const PostCardSkeleton = () => {
    return (
        <div className="post-card skeleton">
            <div className="card-content">
                <div className="card-container-left">
                    <div className="card-head">
                        <Skeleton width="100px" height={30}></Skeleton>
                        <Skeleton width="200px" height={30}></Skeleton>
                    </div>
                    <div className="card-title">
                        <Skeleton width="100%" height={40}></Skeleton>
                        <hr/>
                    </div>
                </div>
                <div className="card-container-right skeleton">
                    <div className="body">
                        <Skeleton width="100%" height="200px"></Skeleton>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostCardSkeleton;