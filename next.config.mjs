/** @type {import('next').NextConfig} */
const nextConfig = {
	sassOptions: {
		silenceDeprecations: ["legacy-js-api"],
		additionalData: `
      $white: #fff;
      $black: #000;

      $gray0: #f8f9fa;
      $gray1: #f1f3f5;
      $gray2: #e9ecef;
      $gray3: #dee2e6;
      $gray4: #ced4da;
      $gray5: #adb5bd;
      $gray6: #868e96;
      $gray7: #495057;
      $gray8: #343a40;
      $gray9: #212529;

      $red0: #fff5f5;
      $red1: #ffe3e3;
      $red2: #ffc9c9;
      $red3: #ffa8a8;
      $red4: #ff8787;
      $red5: #ff6b6b;
      $red6: #fa5252;
      $red7: #f03e3e;
      $red8: #e03131;
      $red9: #c92a2a;

      $pink0: #fff0f6;
      $pink1: #ffdeeb;
      $pink2: #fcc2d7;
      $pink3: #faa2c1;
      $pink4: #f783ac;
      $pink5: #f06595;
      $pink6: #e64980;
      $pink7: #d6336c;
      $pink8: #c2255c;
      $pink9: #a61e4d;

      $grape0: #f8f0fc;
      $grape1: #f3d9fa;
      $grape2: #eebefa;
      $grape3: #e599f7;
      $grape4: #da77f2;
      $grape5: #cc5de8;
      $grape6: #be4bdb;
      $grape7: #ae3ec9;
      $grape8: #9c36b5;
      $grape9: #862e9c;

      $blue0: #D1E9FF;
      $blue1: #B2DDFF;
      $blue2: #84CAFF;
      $blue3: #53B1FD;
      $blue4: #2E90FA;
      $blue5: #1570EF;
      $blue6: #175CD3;
      $blue7: #1849A9;
      $blue8: #194185;
      $blue9: #102A56;

      $teal0: #e6fcf5;
      $teal1: #c3fae8;
      $teal2: #96f2d7;
      $teal3: #63e6be;
      $teal4: #38d9a9;
      $teal5: #20c997;
      $teal6: #12b886;
      $teal7: #0ca678;
      $teal8: #099268;
      $teal9: #087f5b;

      $green0: #ebfbee;
      $green1: #d3f9d8;
      $green2: #b2f2bb;
      $green3: #8ce99a;
      $green4: #69db7c;
      $green5: #51cf66;
      $green6: #40c057;
      $green7: #37b24d;
      $green8: #2f9e44;
      $green9: #2b8a3e;

      $yellow0: #fefce8;
      $yellow1: #fef9c3;
      $yellow2: #fef08a;
      $yellow3: #fde047;
      $yellow4: #facc15;
      $yellow5: #eab308;
      $yellow6: #ca8a04;
      $yellow7: #845209;
      $yellow8: #713f12;
      $yellow9: #422006;

      $text-xss: 1.2rem;
      $text-sm: 1.4rem;
      $text-md: 1.6rem;
      $text-lg: 2rem;
      $text-xl: 2.4rem;
      $text-2xl: 2.8rem;
      $text-3xl: 3.2rem;
      $text-4xl: 4rem;
      $text-5xl: 4.8rem;
      $text-6xl: 5.6rem;
      $text-7xl: 6.4rem;
      $text-8xl: 7.2rem;
      $text-9xl: 8rem;

      $light: 300;
      $normal: 400;
      $medium: 500;
      $semi: 600;
      $bold: 700;

      $line80: 80%;
      $line125: 125%;
      $line160: 160%;
      $line200: 200%;

      $radii-none: 0px;
      $radii-xxs: 2px;
      $radii-xs: 4px;
      $radii-sm: 6px; 
      $radii-md: 8px;
      $radii-lg: 10px;
      $radii-xl: 12px;
      $radii-2xl: 16px;
      $radii-3xl: 20px;
      $radii-4xl: 24px;
      $radii-full: 9999px;

      $spacing-0: 0rem;
      $spacing-05: 0.2rem;
      $spacing-1: 0.4rem;
      $spacing-2: 0.8rem;
      $spacing-3: 1.2rem;
      $spacing-4: 1.6rem; 
      $spacing-5: 2rem;
      $spacing-6: 2.4rem;
      $spacing-8: 3.2rem;
      $spacing-10: 4rem;
      $spacing-12: 4.8rem;
      $spacing-16: 6.4rem;
      $spacing-20: 8rem;
      $spacing-24: 9.6rem;
      $spacing-32: 12.8rem;
      $spacing-40: 16rem;
      $spacing-48: 19.2rem;
      $spacing-56: 22.4rem;
      $spacing-64: 25.6rem;
      $spacing-80: 32rem;
      $spacing-96: 38.4rem;
      $spacing-120: 48rem;
      $spacing-140: 56rem;
      $spacing-160: 64rem;
      $spacing-180: 72rem;
      $spacing-192: 76.8rem;
      $spacing-256: 102.4rem;
      $spacing-320: 128rem;
      $spacing-360: 144rem;
      $spacing-400: 160rem; 
      $spacing-480: 192 rem;

      $shadow-xs: 0px 1px 2px 0 rgba(10, 13, 18, 0.06);
      $shadow-sm: 0px 1px 2px 0 rgba(10, 13, 18, 0.1), 0px 1px 3px 0 rgba(10, 13, 18, 0.1);
      $shadow-md: 0px 4px 6px -1px rgba(10, 13, 18, 0.1), 0px 2px 4px -2px rgba(10, 13, 18, 0.06);
      $shadow-lg: 0px 12px 16px -4px rgba(10, 13, 18, 0.08), 0px 2px 4px -2px rgba(10, 13, 18, 0.03), 0px 2px 2px -1px rgba(10, 13, 18, 0.04);
      $shadow-xl: 0px 20px 24px -4px rgba(10, 13, 18, 0.08), 0px 8px 8px -4px rgba(10, 13, 18, 0.03), 0px 3px 3px -2px rgba(10, 13, 18, 0.04);
      $shadow-2xl: 0px 24px 48px -12px rgba(10, 13, 18, 0.18), 0px 4px 4px -2px rgba(10, 13, 18, 0.04);
      $shadow-3xl: 0px 32px 64px -12px rgba(10, 13, 18, 0.14), 0px 5px 5px -2.5px rgba(10, 13, 18, 0.04);
    `,
	},
};

export default nextConfig;
