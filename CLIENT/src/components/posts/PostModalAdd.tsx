// import { PostModalCreateProps } from "@/redux/types/post.types";
// import React, { useState } from "react";

// const PostModalAdd = () => {
//   const [picture, setPicture] = useState<string | null>(null);
//   const [isNext, setIsNext] = useState<boolean>();
//   const handlePicture = (e: React.ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files) setPicture(URL.createObjectURL(e.target.files[0]));
//   };

//   const [formData, setFormData] = useState({
//     picture: "",
//     message: "",
//     posterId: "",
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   const handlePost = async () => {};

//   return (
//     <div>
//       {isOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg max-w-sm md:max-w-lg w-full mx-4 relative">
//             <div className="flex justify-between items-center mb-4">
//               <button
//                 // onClick={handleCloseModal}
//                 className="text-gray-500 font-bold text-lg self-end"
//               >
//                 X
//               </button>
//               {picture && (
//                 <button
//                   onClick={() => setIsNext(true)}
//                   className="text-blue-500 font-semibold hover:text-black rounded-lg p-1.5"
//                 >
//                   Suivant
//                 </button>
//               )}
//             </div>
//             <div>
//               <div className="border-b pb-2 text-center">
//                 <p>Créer une nouvelle publication</p>
//               </div>
//               <div className="flex w-full">
//                 <div className="flex flex-col items-center gap-8">
//                   <div>
//                     {picture ? (
//                       <img src={picture} />
//                     ) : (
//                       <img
//                         src="img/image-galery.png"
//                         alt=""
//                         className="w-52 h-52"
//                       />
//                     )}
//                   </div>
//                   <div>
//                     <input
//                       type="file"
//                       id="file-upload"
//                       name="file"
//                       accept=".png, .jpg, .jpeg"
//                       className="hidden"
//                       onChange={handlePicture}
//                     />
//                     <label
//                       htmlFor="file-upload"
//                       className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition duration-300"
//                     >
//                       Importer une photo
//                     </label>
//                   </div>
//                 </div>
//                 {isNext && (
//                   <div className="bg-gray-200 w-full">
//                     <h1>Partie texte</h1>
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PostModalAdd;
import React from "react";

const PostModalAdd = () => {
  return <div></div>;
};

export default PostModalAdd;
