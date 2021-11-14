import React from "react";
import ScriptTag from 'react-script-tag';

export default function HomeScript() {
    return (
        <div>
            <ScriptTag type={'text/jsx'} src="../../../Assets/js/jquery-3.3.1.min.js"
                       tppabs="https://preview.colorlib.com/theme/tutor/js/jquery-3.3.1.min.js"></ScriptTag>
            <ScriptTag type={'text/jsx'}
                       src="../../../Assets/js/popper.min.js+bootstrap.min.js.pagespeed.jc.uM7nYiJN9h.js"
                       tppabs="https://preview.colorlib.com/theme/tutor/js/popper.min.js+bootstrap.min.js.pagespeed.jc.uM7nYiJN9h.js"></ScriptTag>
            {/*<ScriptTag>eval(mod_pagespeed_YMJYAqn8M9);</ScriptTag>*/}
            {/*<ScriptTag>eval(mod_pagespeed_ka80pH9ite);</ScriptTag>*/}
            <ScriptTag type={'text/jsx'}
                       src="../../../Assets/js/owl.carousel.min.js+jquery.sticky.js+jquery.waypoints.min.js+jquery.animateNumber.min.js.pagespeed.jc.kJx0YVVJ0h.js"
                       tppabs="https://preview.colorlib.com/theme/tutor/js/owl.carousel.min.js+jquery.sticky.js+jquery.waypoints.min.js+jquery.animateNumber.min.js.pagespeed.jc.kJx0YVVJ0h.js"></ScriptTag>
            {/*<ScriptTag>eval(mod_pagespeed_gz_muqayKS);</ScriptTag>*/}
            {/*<ScriptTag>eval(mod_pagespeed_WSl7wavBqp);</ScriptTag>*/}
            {/*<ScriptTag>eval(mod_pagespeed_3QStrlShED);</ScriptTag>*/}
            {/*<ScriptTag>eval(mod_pagespeed_j8bvL4ukG9);</ScriptTag>*/}
            <ScriptTag type={'text/jsx'}
                       src="../../../Assets/js/jquery.fancybox.min.js+jquery.easing.1.3.js.pagespeed.jc.jC3zSnA0bi.js"
                       tppabs="https://preview.colorlib.com/theme/tutor/js/jquery.fancybox.min.js+jquery.easing.1.3.js.pagespeed.jc.jC3zSnA0bi.js"></ScriptTag>
            {/*<ScriptTag>eval(mod_pagespeed_2OVJgyUIyU);</ScriptTag>*/}
            {/*<ScriptTag>eval(mod_pagespeed_BBIvToIqye);</ScriptTag>*/}
            <ScriptTag type={'text/jsx'}
                       src="../../../Assets/js/bootstrap-datepicker.min.js+aos.js+main.js.pagespeed.jc.ptL4afNiX0.js"
                       tppabs="https://preview.colorlib.com/theme/tutor/js/bootstrap-datepicker.min.js+aos.js+main.js.pagespeed.jc.ptL4afNiX0.js"></ScriptTag>
            {/*<ScriptTag>eval(mod_pagespeed_8KdzOS9il1);</ScriptTag>*/}
            {/*<ScriptTag>eval(mod_pagespeed_mhTlcsfe4A);</ScriptTag>*/}
            {/*<ScriptTag>eval(mod_pagespeed_NOlNnb69yz);</ScriptTag>*/}

            <ScriptTag type={'text/jsx'} async src="../../../Assets/js/js-id=UA-23581568-13.js"
                       tppabs="https://www.googletagmanager.com/gtag/js?id=UA-23581568-13"></ScriptTag>
            {/*window.dataLayer = window.dataLayer || [];*/}
            {/*function gtag() { dataLayer.push(arguments) }*/}
            {/*gtag('js', new Date());*/}
            {/*gtag('config', 'UA-23581568-13');*/}
            <ScriptTag type={'text/jsx'} defer src="../../../Assets/js/beacon.min.js"
                       tppabs="https://static.cloudflareinsights.com/beacon.min.js"
                       data-cf-beacon='{"rayId":"6a6a4e2765bf18e8","token":"cd0b4b3a733644fc843ef0b185f98241","version":"2021.10.0","si":100}'></ScriptTag>
            <ScriptTag type={'text/jsx'} defer src="../../../Assets/js/beacon.min.js"
                       tppabs="https://static.cloudflareinsights.com/beacon.min.js"
                       data-cf-beacon='{"rayId":"6a6a4e272d7d18e8","token":"cd0b4b3a733644fc843ef0b185f98241","version":"2021.10.0","si":100}'></ScriptTag>
        </div>
    )
}