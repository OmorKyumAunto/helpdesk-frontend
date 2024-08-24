// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Row, Col, Table, Tooltip, Typography } from "antd";
// import { TableProps } from "antd/lib";
// import { PrinterOutlined, DownloadOutlined } from "@ant-design/icons";
// import { useEffect, useRef } from "react";
// import { useReactToPrint } from "react-to-print";
// import {
//   IInvoiceProductItem,
//   ISingleInvoice,
// } from "../../modules/invoice/types/invoiceTypes";
// import generatePDF from "react-to-pdf";

// import { imageURL } from "../../app/slice/baseQuery";
// import dayjs from "dayjs";
// import { payrollTitleStyle } from "../../modules/Payroll/Styles/PayrollStyles";
// import { InvoiceHeader } from "../formItem/InvoiceHeader";
// import { DetailsView } from "../commonDetailsView/CommonDetailsView";
// // import { useDispatch } from "react-redux";
// // import { setCommonModal } from "../../app/slice/modalSlice";
// // import UpdateInvoice from "../../modules/invoice/components/UpdateInvoice";
// const PrintInvoice = ({ data }: { data: ISingleInvoice }) => {
//   // const { toPDF, targetRef } = usePDF({
//   //   filename: `${data?.client_name}_invoice.pdf`,
//   // });

//   // const { data: profile } = useGetMeQuery();
//   // const profileInfo = profile?.data?.permissions?.modules;

//   // const invoice = profileInfo?.find((i: any) => i?.module_name === "invoice");

//   // console.log("qwqw", invoice?.sub_modules[0]?.permissions);

//   // const dispatch = useDispatch();
//   // const showModal = (record: any) => {
//   //   dispatch(
//   //     setCommonModal({
//   //       title: "Edit invoice",
//   //       content: <UpdateInvoice record={record} />,
//   //       show: true,
//   //     })
//   //   );
//   // };
//   // const dispatch = useDispatch();
//   // const showModal = (record: IInvoice) => {
//   //   dispatch(
//   //     setCommonModal({
//   //       title: "Edit invoice",
//   //       content: <UpdateInvoice record={record} />,
//   //       show: true,
//   //     })
//   //   );
//   // };

//   const componentRef = useRef<HTMLDivElement | null>(null);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     documentTitle: `${data?.member_name}_invoice`,
//     removeAfterPrint: true,
//   });

//   useEffect(() => {
//     const handleKeyDown = (event: any) => {
//       if ((event.ctrlKey || event.metaKey) && event.key === "p") {
//         event.preventDefault();
//         handlePrint();
//       }
//     };

//     document.addEventListener("keydown", handleKeyDown);

//     return () => {
//       document.removeEventListener("keydown", handleKeyDown);
//     };
//   }, []);

//   const columns: TableProps<IInvoiceProductItem>["columns"] = [
//     {
//       title: "Service Name",
//       dataIndex: "item_name",
//       key: "item_name",
//     },
//     // {
//     //   title: "Description",
//     //   dataIndex: "description",
//     //   key: "description",
//     // },
//     {
//       title: "Quantity",
//       dataIndex: "quantity",
//       key: "quantity",
//     },
//     {
//       title: "Price",
//       dataIndex: "unit_price",
//       key: "unit_price",
//       render: (unit) => <p>{parseFloat(unit).toFixed(2)}</p>,
//     },

//     {
//       title: <p style={{ textAlign: "right" }}>Total Price</p>,
//       render: (record: any) => (
//         <div style={{ textAlign: "right" }}>
//           {record?.quantity * record?.unit_price}
//         </div>
//       ),
//     },
//   ];
//   const subtotal = data?.invoice_items?.reduce((total: any, item: any) => {
//     const quantity = item?.quantity ?? 0;
//     const unitPrice = item?.unit_price ?? 0;
//     return total + quantity * unitPrice;
//   }, 0);

//   return (
//     <div className="print-invoice-wrapper">
//       <div style={{ textAlign: "end", padding: "5px" }}>
//         {/* <Tooltip placement="top" title={"Edit"}>
//           <Button
//             size="small"
//             type="primary"
//             style={{
//               background: "#00b4e9",
//               fontSize: "15px",
//               marginRight: "30px",
//             }}
//             onClick={() => showModal(data)}
//           >
//             Update
//           </Button>
//         </Tooltip> */}

//         <Tooltip title="Download Invoice">
//           <DownloadOutlined
//             style={{ fontSize: "25px", marginRight: "20px" }}
//             onClick={() =>
//               generatePDF(componentRef, {
//                 filename: `${data?.member_name}_invoice.pdf`,
//               })
//             }
//           />
//         </Tooltip>
//         <Tooltip title="Print Invoice">
//           <PrinterOutlined style={{ fontSize: "25px" }} onClick={handlePrint} />
//         </Tooltip>
//       </div>

//       <div style={{ padding: "16px" }} ref={componentRef}>
//         <div>
//           <InvoiceHeader />
//         </div>
//         <Row justify={"center"}>
//           <Typography.Title level={5} style={payrollTitleStyle}>
//             {"INVOICE"}
//           </Typography.Title>
//         </Row>

//         {/* <div
//           style={{
//             fontSize: "22px",
//             textAlign: "center",
//             // border: "1px solid #00b4e9",
//             borderRadius: "10px",
//             padding: "2px",
//             // marginBottom: "10px",
//           }}
//         >
//           INVOICE
//         </div> */}

//         <div className="p-10 ps-14">
//           <Row
//             gutter={[16, 16]}
//             justify="space-between"
//             className="invoice-row"
//           >
//             <Col
//               xs={24}
//               sm={24}
//               md={24}
//               lg={24}
//               xl={14}
//               xxl={14}
//               className="invoice-col"
//             >
//               <div>
//                 <div className="invoice-title-div">
//                   <p style={{ fontSize: "18px", fontWeight: "bold" }}>
//                     Invoice To
//                   </p>
//                 </div>
//                 <div>
//                   <DetailsView title="Name" value={data?.member_name} />
//                   <DetailsView title="Cell No" value={data?.member_mobile} />
//                   <DetailsView title="Email" value={data?.member_email} />
//                   {/* <DetailsView title="Address" value={data?.member_address} /> */}
//                 </div>
//               </div>
//             </Col>
//             <Col
//               xs={24}
//               sm={24}
//               md={24}
//               lg={24}
//               xl={10}
//               xxl={10}
//               className="invoice-col invo "
//             >
//               <div>
//                 <div>
//                   <DetailsView
//                     title="Invoice Date"
//                     value={dayjs(data?.invoice_date).format("DD-MM-YYYY")}
//                   />
//                   <DetailsView title="Invoice No" value={data?.invoice_no} />
//                   {/* <DetailsView title="Sales By" value={data?.employee_name} /> */}
//                   {/* {data?.remark && (
//                     <DetailsView title="Remark" value={data?.remark} />
//                   )} */}
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>

//         {/* <div className="p-10">
//           <Row
//             gutter={[16, 16]}
//             justify="space-between"
//             style={{ display: "flex" }}
//           >
//             <Col xs={24} md={12} xl={12}>
//               <div>
//                 <div className="invoice-title-div">
//                   <p style={{ fontSize: "18px", fontWeight: "bold" }}>
//                     Paid To
//                   </p>
//                 </div>
//                 <div>
//                   <DetailsView title="Name" value={data?.client_name} />
//                   <DetailsView title="Cell No" value={data?.client_mobile} />
//                   <DetailsView title="Email" value={data?.client_email} />
//                   <DetailsView title="Address" value={data?.client_address} />
//                 </div>
//               </div>
//               <div style={{ paddingTop: "15px" }}>
//                 <h3>Remark</h3>
//                 <p>{data?.remark}</p>
//               </div>
//             </Col>
//             <Col xs={24} md={12} xl={8}>
//               <div>
//                 <div className="invoice-title-div">
//                   <p style={{ fontSize: "18px", fontWeight: "bold" }}>
//                     Invoice Info
//                   </p>
//                 </div>
//                 <div>
//                   <DetailsView title="Invoice No" value={data?.invoice_no} />
//                   <DetailsView
//                     title="Invoice Date"
//                     value={dayjs(data?.invoice_date).format("DD-MM-YYYY")}
//                   />
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div> */}

//         <div className="p-10">
//           <Row align={"middle"} gutter={[8, 0]}>
//             <Col xs={24} sm={24} md={24} xl={24}>
//               <div>
//                 <h5 style={{ fontWeight: "bold", fontSize: "16px" }}>
//                   Billing Information
//                 </h5>

//                 <div className="p-16  ">
//                   <Table
//                     rowKey={"product_id"}
//                     size="small"
//                     columns={columns}
//                     dataSource={
//                       data?.invoice_items?.length ? data.invoice_items : []
//                     }
//                     bordered
//                     pagination={false}
//                   />
//                 </div>
//               </div>
//             </Col>
//           </Row>
//         </div>

//         <div className="p-10">
//           <Row
//             gutter={[8, 0]}
//             justify={"space-between"}
//             style={{ display: "flex" }}
//           >
//             <Col xs={12} md={12} xl={12}>
//               <div>
//                 <div style={{ paddingBottom: "15px" }}>
//                   <h3>Note</h3>
//                   <p>{data?.note}</p>
//                 </div>

//                 <div>
//                   {/* <h5>Terms And Condition</h5> */}
//                   <span style={{ fontSize: "12.1px" }}></span>
//                 </div>
//               </div>
//             </Col>
//             <Col xs={12} md={12} xl={12} style={{}}>
//               <table className="invoice-table">
//                 <tbody>
//                   <tr>
//                     <th>SubTotal</th>
//                     <td>{subtotal || 0}</td>
//                   </tr>

//                   <tr>
//                     <th>(+ BDT) Vat</th>
//                     <td>{parseInt(data?.vat) || 0}</td>
//                   </tr>
//                   <tr>
//                     <th> (- BDT) Discount</th>
//                     <td>{parseInt(data?.discount) || 0}</td>
//                   </tr>
//                   <tr>
//                     <th>Net total</th>
//                     <td>{parseInt(data?.net_total) || 0}</td>
//                   </tr>

//                   <tr>
//                     <th>Due</th>
//                     <td>{parseInt(data?.net_total) || 0}</td>
//                   </tr>
//                 </tbody>
//               </table>
//             </Col>
//           </Row>
//         </div>

//         {/* bottom part  */}
//         <div
//           style={{
//             marginTop: "40px",
//             position: "relative",
//             // marginTop: "30px",
//             textAlign: "center",
//             padding: "10px",
//           }}
//         >
//           <div
//             style={{
//               display: "flex",
//               justifyContent: "space-between",
//               alignItems: "flex-end",
//             }}
//           >
//             {" "}
//             <div style={{ textAlign: "right" }}>
//               <p style={{ border: "1px solid gray" }}></p>
//               <p style={{ margin: 0 }}>Member Signature</p>
//             </div>
//             <div style={{ textAlign: "left" }}>
//               <img src={data?.signature && imageURL + data?.signature} alt="" />
//               <p style={{ border: "1px solid gray" }}></p>
//               <p style={{ margin: 0 }}>Authorized Signature</p>
//             </div>
//           </div>
//           <div>
//             <p style={{ fontSize: "10px", marginTop: "5px" }}>
//               This is Software Generated Bill. AM CHAM Developed By: M360 ICT,
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
// export default PrintInvoice;
