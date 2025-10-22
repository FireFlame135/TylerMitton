import{r as s,j as o,B as i}from"./index-CVj_Ts-P.js";import{c as a}from"./SEO-C0P0BPqX.js";/**
 * @license lucide-react v0.462.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n=a("ChevronUp",[["path",{d:"m18 15-6-6-6 6",key:"153udz"}]]),g=()=>{const[t,r]=s.useState(!1);s.useEffect(()=>{const e=()=>{window.scrollY>300?r(!0):r(!1)};return window.addEventListener("scroll",e),()=>window.removeEventListener("scroll",e)},[]);const l=()=>{window.scrollTo({top:0,behavior:"smooth"})};return o.jsx(o.Fragment,{children:t&&o.jsx(i,{onClick:l,className:"fixed bottom-8 right-8 z-50 h-12 w-12 rounded-full shadow-lg bg-gray-600 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-500 transition-all duration-300","aria-label":"Scroll to top",children:o.jsx(n,{size:24})})})};export{g as S};
