import { useEffect, useState } from "react";
import { useTransition, animated } from "react-spring";

import "@styles/components/flash.scss";

const Flash = ({error, message}) => {

    const [isVisible, setIsVisible] = useState(false);

    const transition = useTransition(isVisible, {
        from: { opacity: 0 },
        enter: { opacity: 1 },
        leave: { opacity: 0 },
        config: { duration: 500 },
    })

    const content = error ? formatURL(error) : formatURL(message) || "";
    
    // console.log("FLASH", error || message);

    function formatURL(param) {
        if (param !== null) {
            return param.split("_").join(" ")
        } else {
            return "";
        }
    } 

    useEffect(() => {
        if (content !== null) {
            setIsVisible(true);

            const hideTimeout = setTimeout(() => {
                setIsVisible(false);
              }, 2000);

            return () => {
                clearTimeout(hideTimeout); 
            };
        }
    }, [content])


    return (
            <>
                {transition((style, item) =>
                    item ? (
                        <animated.div style={style} className={`flash ${error ? '' : 'message'}` }>
                            <p>{formatURL(content)}</p>
                        </animated.div>
                    ) : (
                        ""
                    )
                )}
            </>
    )
}


export default Flash


