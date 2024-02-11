"use client";

import { useSearchParams } from 'next/navigation'

export default function TestIframe() {
  const searchParams = useSearchParams();
  const test = searchParams.get("test");
  const prod = "https://iframe-ten-tau.vercel.app/0x59293a46d552e56130647f648bcfe255ad3abbcc/17/1"
  const local = "http://localhost:3000/0x59293a46d552e56130647f648bcfe255ad3abbcc/17/1"

  const toTest = test && String(test).toLowerCase() === "prod" ? prod : local;

  return (
    <section className="p-6 flex flex-col gap-6">
      <div className="text-5xl">
        Testing iFrame
      </div>
    <div className="flex flex-row gap-6">
      <div className="min-w-[500px] h-[500px]">
        <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" className="w-full h-full" frameBorder="0" height="100%" id="AssetMedia--frame" sandbox="allow-scripts" src={toTest}></iframe>
      </div>
      <div>
        title & description

        Duis vel sem sed nunc congue viverra a non odio. Vestibulum interdum vitae erat nec fermentum. Duis mollis consequat eros, eget blandit nibh euismod non. Nulla tincidunt mi nunc, ut facilisis odio tincidunt eu. Nunc vel fermentum purus. Etiam vehicula sollicitudin condimentum. Ut quis fringilla quam, et luctus dolor. Integer rhoncus tortor eget interdum ultrices. Phasellus vestibulum, quam in fringilla venenatis, sapien dolor hendrerit eros, nec congue massa quam eget tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed cursus est erat, id mattis turpis dictum at. Suspendisse tincidunt turpis vel elit varius dapibus. Suspendisse potenti.
      </div>
    </div>
    <div className="flex flex-row gap-6">
      <div>
       lDuis vel sem sed nunc congue viverra a non odio. Vestibulum interdum vitae erat nec fermentum. Duis mollis consequat eros, eget blandit nibh euismod non. Nulla tincidunt mi nunc, ut facilisis odio tincidunt eu. Nunc vel fermentum purus. Etiam vehicula sollicitudin condimentum. Ut quis fringilla quam, et luctus dolor. Integer rhoncus tortor eget interdum ultrices. Phasellus vestibulum, quam in fringilla venenatis, sapien dolor hendrerit eros, nec congue massa quam eget tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed cursus est erat, id mattis turpis dictum at. Suspendisse tincidunt turpis vel elit varius dapibus. Suspendisse potenti.
      </div>
      <div>
      Duis vel sem sed nunc congue viverra a non odio. Vestibulum interdum vitae erat nec fermentum. Duis mollis consequat eros, eget blandit nibh euismod non. Nulla tincidunt mi nunc, ut facilisis odio tincidunt eu. Nunc vel fermentum purus. Etiam vehicula sollicitudin condimentum. Ut quis fringilla quam, et luctus dolor. Integer rhoncus tortor eget interdum ultrices. Phasellus vestibulum, quam in fringilla venenatis, sapien dolor hendrerit eros, nec congue massa quam eget tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed cursus est erat, id mattis turpis dictum at. Suspendisse tincidunt turpis vel elit varius dapibus. Suspendisse potenti.
      </div>
    </div>
    <div>
       lDuis vel sem sed nunc congue viverra a non odio. Vestibulum interdum vitae erat nec fermentum. Duis mollis consequat eros, eget blandit nibh euismod non. Nulla tincidunt mi nunc, ut facilisis odio tincidunt eu. Nunc vel fermentum purus. Etiam vehicula sollicitudin condimentum. Ut quis fringilla quam, et luctus dolor. Integer rhoncus tortor eget interdum ultrices. Phasellus vestibulum, quam in fringilla venenatis, sapien dolor hendrerit eros, nec congue massa quam eget tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed cursus est erat, id mattis turpis dictum at. Suspendisse tincidunt turpis vel elit varius dapibus. Suspendisse potenti. Cras id magna ut justo commodo venenatis non id est. Integer ac metus feugiat nisl faucibus maximus scelerisque ac lorem. Nam ultrices pellentesque eleifend. Vivamus vitae nisi ac dui sagittis vehicula. Phasellus mauris justo, porta molestie augue et, accumsan tincidunt justo. Pellentesque aliquam tristique mauris. Curabitur et odio vitae mauris sodales tristique vel sit amet est. Phasellus laoreet ultricies mauris sed porttitor.
    </div>
    <div className="flex flex-row gap-6">
      <div>
       lDuis vel sem sed nunc congue viverra a non odio. Vestibulum interdum vitae erat nec fermentum. Duis mollis consequat eros, eget blandit nibh euismod non. Nulla tincidunt mi nunc, ut facilisis odio tincidunt eu. Nunc vel fermentum purus. Etiam vehicula sollicitudin condimentum. Ut quis fringilla quam, et luctus dolor. Integer rhoncus tortor eget interdum ultrices. Phasellus vestibulum, quam in fringilla venenatis, sapien dolor hendrerit eros, nec congue massa quam eget tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed cursus est erat, id mattis turpis dictum at. Suspendisse tincidunt turpis vel elit varius dapibus. Suspendisse potenti.
      </div>
      <div>
      Duis vel sem sed nunc congue viverra a non odio. Vestibulum interdum vitae erat nec fermentum. Duis mollis consequat eros, eget blandit nibh euismod non. Nulla tincidunt mi nunc, ut facilisis odio tincidunt eu. Nunc vel fermentum purus. Etiam vehicula sollicitudin condimentum. Ut quis fringilla quam, et luctus dolor. Integer rhoncus tortor eget interdum ultrices. Phasellus vestibulum, quam in fringilla venenatis, sapien dolor hendrerit eros, nec congue massa quam eget tellus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Sed cursus est erat, id mattis turpis dictum at. Suspendisse tincidunt turpis vel elit varius dapibus. Suspendisse potenti.
      </div>
    </div>
    </section>
  )
}