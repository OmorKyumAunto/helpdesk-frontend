// /* eslint-disable @typescript-eslint/no-explicit-any */
// import React from "react";
// import { Typography } from "antd";
// import dayjs from "dayjs";
// import { PrintHeader } from "./PrintHeader";
// import { InvoiceHeader } from "../formItem/InvoiceHeader";
// import TitleCenter from "../invoice/TitleCenter";
// const a4sizeStyle: React.CSSProperties = {
//   minHeight: "100vh",
//   // width: "11.5in",
//   fontSize: "11px",
//   // height: '200px',
//   background: "#fff",
//   boxSizing: "border-box",
//   padding: "0 15px",
// };

// type Props = {
//   extraInfo?: any;
//   printRef: React.RefObject<HTMLDivElement>;
//   children: JSX.Element;
//   title: string;
//   isPrintFooterShowing?: boolean;
// };

// const CommonViewReport = ({
//   printRef,
//   children,
//   extraInfo,
//   title,
//   isPrintFooterShowing,
// }: Props) => {
//   const printDate = dayjs().format("DD-MM-YYYY ");
//   return (
//     <>
//       <div
//         ref={printRef}
//         style={{
//           ...a4sizeStyle,
//           position: "relative",
//         }}
//       >
//         <Typography.Text
//           style={{
//             display: "block",
//             fontSize: "11px",
//             fontFamily: "'Source Sans Pro', sans-serif",
//             position: "absolute",
//             top: 0,
//             right: 5,
//           }}
//         >
//           Print Date : {printDate}
//         </Typography.Text>
//         <header>
//           <div style={{ border: "0.1px solid white" }}>
//             <PrintHeader />
//           </div>

//           {title ? <TitleCenter title={title} /> : ""}

//           <div style={{ textAlign: "start", marginBottom: "20px" }}>
//             {" "}
//             {extraInfo && extraInfo}
//           </div>
//           {/* {extraInfo && (
//             <Row justify={"space-between"} align="middle">
//               <Col
//                 style={{
//                   color: "#fff",
//                   fontFamily: "'Source Sans Pro', sans-serif",
//                   width: "50%",
//                 }}
//               >
//                 {title ? (
//                   <Typography.Title
//                     style={{ fontFamily: "'Source Sans Pro', sans-serif" }}
//                     level={5}
//                   >
//                     {title}:
//                   </Typography.Title>
//                 ) : (
//                   ""
//                 )}
//                 {extraInfo?.name && (
//                   <Typography.Text
//                     style={{
//                       display: "block",
//                       fontSize: "13px",
//                       fontFamily: "'Source Sans Pro', sans-serif",
//                     }}
//                   >
//                     <b>Name :</b> {extraInfo?.name}
//                   </Typography.Text>
//                 )}
//                 {extraInfo?.address && (
//                   <Typography.Text
//                     style={{
//                       display: "block",
//                       fontSize: "13px",
//                       fontFamily: "'Source Sans Pro', sans-serif",
//                     }}
//                   >
//                     <b>Address :</b> {extraInfo?.address}
//                   </Typography.Text>
//                 )}
//                 {extraInfo?.email && (
//                   <Typography.Text
//                     style={{
//                       display: "block",
//                       fontSize: "13px",
//                       fontFamily: "'Source Sans Pro', sans-serif",
//                     }}
//                   >
//                     <b>Email :</b> {extraInfo?.email}
//                   </Typography.Text>
//                 )}
//                 {extraInfo?.mobile && (
//                   <Typography.Text
//                     style={{
//                       display: "block",
//                       fontSize: "13px",
//                       fontFamily: "'Source Sans Pro', sans-serif",
//                     }}
//                   >
//                     <b>Mobile :</b> {extraInfo?.mobile}
//                   </Typography.Text>
//                 )}
//               </Col>
//             </Row>
//           )} */}
//         </header>
//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "space-between",
//             fontFamily: "'Source Sans Pro', sans-serif",
//             boxSizing: "border-box",
//             position: "relative",
//             // minHeight: '5.5in',
//           }}
//         >
//           {/* <div
//             style={{
//               position: "absolute",
//               top: "100px",
//               right: "50%",
//               transform: "translateX(50%)",
//               bottom: "0px",
//               pointerEvents: "none",
//               fontSize: 150,
//               opacity: 0.05,
//               zIndex: 9,
//               userSelect: "none",
//             }}
//           >
//             <LandscapeWaterMark />
//           </div> */}
//           {children}
//           {/* bottom part  */}

//           {isPrintFooterShowing && (
//             <div
//               style={{
//                 display: "flex",
//                 justifyContent: "space-between",
//               }}
//             >
//               <Typography.Text
//                 style={{
//                   marginLeft: "10px",
//                   borderTop: "1px dashed gray",
//                   fontFamily: "'Source Sans Pro', sans-serif",
//                 }}
//               >
//                 Customer Signature
//               </Typography.Text>

//               <Typography.Text
//                 style={{
//                   marginRight: "10px",
//                   borderTop: "1px dashed gray",
//                   fontFamily: "'Source Sans Pro', sans-serif",
//                 }}
//               >
//                 Authority Signature
//               </Typography.Text>
//             </div>
//           )}
//         </div>
//         <div
//           style={{
//             position: "fixed",
//             // marginTop: "10px",
//             bottom: 5,
//             left: 0,
//             right: 0,
//             margin: "auto",
//             textAlign: "center",
//           }}
//         >
//           <p style={{ fontSize: "12px" }}>
//             This is Software Generated Print,
//             <br />
//             AMCHAM Developed By: M360 ICT
//           </p>
//         </div>
//       </div>
//     </>
//   );
// };

// export default CommonViewReport;
