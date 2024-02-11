"use client";

import { useSearchParams } from 'next/navigation'
import { useSpring, config, useSpringRef, useTransition, useChain, animated } from "@react-spring/web"
import { useState } from 'react';
import data from './data';

/**
 * example: http://localhost:3000/testiframe?contractAddress=0x038a6ee56c17ade0fcfcbfe8d27b448c309baf91&tokenId=1&parentChainId=11155111
 */

export default function TestIframe() {
  const searchParams = useSearchParams();
  const test = searchParams.get("test");
  const parentChainId = searchParams.get("parentChainId");
  const contractAddress = searchParams.get("contractAddress");
  const tokenId = searchParams.get("tokenId");

  const prod = `https://iframe-ten-tau.vercel.app/${contractAddress}/${tokenId}/${parentChainId}`
  const local = `http://localhost:3000/${contractAddress}/${tokenId}/${parentChainId}`

  const toTest = test && String(test).toLowerCase() === "prod" ? prod : local;

  const [open, set] = useState(false);

  const springApi = useSpringRef();
  const { size, ...rest } = useSpring({
    ref: springApi,
    config: config.stiff,
    from: { size: "20%", background: "hotpink" },
    to: {
      size: open ? "100%" : "20%",
      background: open ? "white" : "hotpink",
    },
  });

  const transApi = useSpringRef();
  const transition = useTransition(open ? data : [], {
    ref: transApi,
    trail: 400 / data.length,
    from: { opacity: 0, scale: 0 },
    enter: { opacity: 1, scale: 1 },
    leave: { opacity: 0, scale: 0 },
  });

  // This will orchestrate the two animations above, comment the last arg and it creates a sequence
  useChain(open ? [springApi, transApi] : [transApi, springApi], [
    0,
    open ? 0.1 : 0.6,
  ]);

  return (
    <section className="p-6 flex flex-col gap-6">
      <div className="text-5xl">
        Testing iFrame
      </div>
    <div className="flex flex-row gap-6">
      <div className="min-w-[500px] h-[500px]">
        <iframe allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" className="w-full h-full" frameBorder="0" height="100%" id="AssetMedia--frame" sandbox="allow-scripts" src={toTest}></iframe>
      </div>
      <div className='flex-1'>
      <div className={`
        w-full h-full bg-blue-100 p-[20px] flex items-center justify-center
      `}>
          <animated.div
            style={{ ...rest, width: size, height: size }}
            className={`
              relative grid grid-cols-4 gap-[25px] p-[25px] bg-white rounded-md cursor-pointer will-change-auto
            `}
            onClick={() => set((open) => !open)}
          >
            {transition((style, item) => (
              <animated.div
                className={`
                  w-full h-full bg-white rounded-md will-change-auto
                `}
                style={{ ...style, background: item.css }}
              />
            ))}
          </animated.div>
        </div>
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