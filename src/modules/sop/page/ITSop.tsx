

// App.tsx
import React, { useState } from "react";
import { FaFilePdf, FaFolder } from "react-icons/fa";

const pdf1 = "https://www.dropbox.com/scl/fi/fq28j86lq90n4desydigz/APPENDIX-A-FIRST-LEVEL-IT-SUPPORT.pdf?rlkey=epazulfv1si4ifvpo75wye7wg&st=a50kkacy&raw=1";
const pdf2 = "https://www.dropbox.com/scl/fi/4rm52i2it4yw0l0noe08r/APPENDIX-B-HARDWARE-REQUISITION-FORM.pdf?rlkey=1pxn91v36w8wczlt93iltgg5n&st=swb6uvs4&raw=1";
const pdf3 = "https://www.dropbox.com/scl/fi/a9prf7qxb4fhnofb00apu/APPENDIX-C-DEVICE-PROVISIONING.pdf?rlkey=831bpssqtrhaiuxh8rjhxwpd0&st=fcaoi7xs&raw=1";
const pdf4 = "https://www.dropbox.com/scl/fi/968clhm62hios2iewgh0g/APPENDIX-D-ESCLATION-MATRIX.pdf?rlkey=tipxr5bqc59qaq5envk4hx16h&st=0wx7je3y&raw=1";
const pdf5 = "https://www.dropbox.com/scl/fi/e6nmg0uwdd686weyx43sl/APPENDIX-E-IT-HARDWARE-REQUEST.pdf?rlkey=i2uzvq15ugmfu1niglrw6ryku&st=ankg2u71&raw=1";
const pdf6 = "https://www.dropbox.com/scl/fi/73f5won7e62c7kr65qi1u/APPENDIX-F-TID-FORMAT.pdf?rlkey=kdeho5i4tdajdmug622pvvhv4&st=vqg3bivn&raw=1";
const pdf7 = "https://www.dropbox.com/scl/fi/hrus1d4wdjius42njocxa/SOP-1.0.2-IT-SUPPORT.pdf?rlkey=lgg5n0lx2paqa2xsxv7rs15pl&st=a3hhta1g&raw=1";
const pdf8 = "https://www.dropbox.com/scl/fi/fdwtl89qclewybji1qee0/APPENDIX-A-NEW-JOINER-S-EMAIL-ID-REQUEST-HR-TO-IT-PROCESS-FLOW.pdf?rlkey=4y7f5wq7x0mtahwwu088gonbd&st=dgug3e2p&raw=1";
const pdf9 = "https://www.dropbox.com/scl/fi/6n4rs9kwzpmkafhmc1sgy/APPENDIX-B-EMAIL-REQUISITION-FORM.pdf?rlkey=zwbmya4g8rxujkm2ccf3hsdle&st=d181mvib&raw=1";
const pdf10 = "https://www.dropbox.com/scl/fi/ei9ulf5wt2s7nxnrzov0u/HR-LAPTOP-DESKTOP-REQUEST-TO-IT-PROCESS-FLOW.pdf?rlkey=64bkokwiv6wy3sza60uslmrer&st=5wuynlgn&raw=1";
const pdf11 = "https://www.dropbox.com/scl/fi/0gcdfhm4hq4pod8nlq0lr/SOP-1.0.3-EMAIL-USER-CREATION-AND-DEACTIVATION.pdf?rlkey=8ad5ov4lqh89cfzekjunr0d0m&st=2fxhk23f&raw=1";
const pdf12 = "https://www.dropbox.com/scl/fi/57wrgrr21nworg8iuand8/SOP-1.0.4_EMAIL-ARCHIVING.pdf?rlkey=bvx3zokb41zbv94llj5b8lfii&st=2eyhjf4h&raw=1";
const pdf13 = "https://www.dropbox.com/scl/fi/2lteqd3aszap5aczi90n6/SOP-1.0.5-Network-and-Infrastructure-Management.pdf?rlkey=ndxjk1jqjqfm48p5el5xvfw0b&st=vqxkx9pr&raw=1";
const pdf14 = "https://www.dropbox.com/scl/fi/24klw27g9p95l8yx6zgp4/SOP-1.0.6-FIREWALL-CONFIGURATION.pdf?rlkey=7h9wu7wh70dfpugr08d05dhw1&st=0gxeqavg&raw=1";
const pdf15 = "https://www.dropbox.com/scl/fi/bq3gu8cn3n445ri99czsx/Appendix-A-Switch-Configuration.pdf?rlkey=w7d9nkgxmxs560wvus4746c0u&st=zxguxl7m&raw=1";
const pdf16 = "https://www.dropbox.com/scl/fi/hlgkzx07013i1h11ablcb/SOP-1.0.7_Network-Configuration.pdf?rlkey=xy5hf7e16amc5j85ybn9mc83k&st=3pqhi1bs&raw=1";
const pdf17 = "https://www.dropbox.com/scl/fi/jnwyyyv8te7lmuuk4tlb3/APPENDIX0-A-INCIDENT-RESPONSE-TEAM.pdf?rlkey=8493nuewr06dsosndin5j5hit&st=swhvkykd&raw=1";
const pdf18 = "https://www.dropbox.com/scl/fi/jen90i4b1s1tnx2lihy3b/APPENDIX0-B-IT-DRIVEN-BUSINESS-APPLICATION-LIST.pdf?rlkey=hdipuq9dhhg2tvpym14b511e5&st=1fpa6aab&raw=1";
const pdf19 = "https://www.dropbox.com/scl/fi/03rjt4jxlskysyqeemra1/SOP-1.0.9_INCIDENT-RESPONSE.pdf?rlkey=2zoqzjar26l5h4oiymo6xfm92&st=p1ejuj6y&raw=1";
const pdf20 = "https://www.dropbox.com/scl/fi/zw6hxzmyo0qvpkar32axf/APPENDIX-A-LIST-OF-STANDALONE-SYSTEM.pdf?rlkey=kixx946chqgxa2zf2rjgux6iu&st=dtt5i690&raw=1";
const pdf21 = "https://www.dropbox.com/scl/fi/rqvwiliosj5yy0isrxdbh/APPENDIX-B-DATA-BACKUP-REQUEST-FORM.pdf?rlkey=jsss15t41fd8wkuujsnogcxfd&st=515g7c4r&raw=1";
const pdf22 = "https://www.dropbox.com/scl/fi/7zt6ojizc24thhdw1mgsd/APPENDIX-C-DATA-RESTORE-FORM.pdf?rlkey=2dgsvdql2k1w9iha1feyhnslu&st=f543s39i&raw=1";
const pdf23 = "https://www.dropbox.com/scl/fi/i5aqks5td0q4sh3u3e6q5/APPENDIX-D-QUARTERLY-HALF-YEARLY-YEARLY-DATA-BACKUP-RECORD.pdf?rlkey=rrzitebqpesi4aiorclmm80p6&st=uat48120&raw=1";
const pdf24 = "https://www.dropbox.com/scl/fi/z01qsyk0mhmftdxd17shl/APPENDIX-E-LOGBOOK-FOR-STANDALONE-SYSTEMUSER-DATA-RETENTION.pdf?rlkey=42tnokxwcfy0ozzsmvnf8e11a&st=ds35x0vy&raw=1";
const pdf25 = "https://www.dropbox.com/scl/fi/svoyd4jtdl8zxbrszkt5x/SOP-1.0.10_DATA-BACKUP-AND-RECOVERY.pdf?rlkey=h43s8crvmg8656vdeymnx56hu&st=lx5kviah&raw=1";
const pdf26 = "https://www.dropbox.com/scl/fi/67w9lf4yua83fpkn2lf9s/APPENDIX-A_USER-ACCESS-AUTHORIZATION-FORM.pdf?rlkey=bv6kw11pnp3dh6gr1rsvt8nlm&st=ewgcwc9x&raw=1";
const pdf27 = "https://www.dropbox.com/scl/fi/v5vbtildvybssn4bdd4jb/IT-ACCESS-CONTROL-POLICY.pdf?rlkey=9eeoeba0ts8g5u12p1c8w0kcv&st=8doasit8&raw=1";
const pdf28 = "https://www.dropbox.com/scl/fi/00qh69urnfcqu1rnso8de/SOP-1.0.11_IT-ACCESS-CONTROL.pdf?rlkey=f05lgpmwgrvkq2owf5oaz56xm&st=qyx3gove&raw=1";
const pdf29 = "https://www.dropbox.com/scl/fi/501w8kje8y1r9q9yyhia8/APPENDIX-A_Fixed-Asset-Policy.pdf?rlkey=ld2i2fhw0hvkwtzi199nnvrtb&st=4055e0y0&raw=1";
const pdf30 = "https://www.dropbox.com/scl/fi/surr6ud83lkpw6el1md6z/APPENDIX-B_IT-Policy-Device-and-Reimbursement.pdf?rlkey=pnog5jttd7lubo72bn8eitxxk&st=sj8j7g36&raw=1";
const pdf31 = "https://www.dropbox.com/scl/fi/u4o0pg1bf868t335famiw/APPENDIX-C-Vendor-RFP-Template.pdf?rlkey=erjlwevnljsasz70nwl3qsj7n&st=oz89pepo&raw=1";
const pdf32 = "https://www.dropbox.com/scl/fi/8mhs7t0d5lzeqcwl998uq/SOP-1.0.12_IT-ASSET-MANAGEMENT.pdf?rlkey=dq5mzkg8xh85dr9cci64zfddi&st=hnosf1ds&raw=1";
const pdf33 = "https://www.dropbox.com/scl/fi/rht60aek80ym3s4j0stbi/APPENDIX-C-VENDOR-RFP-TEMPLATE.pdf?rlkey=1sny30niuxa88z36mh7wotqvm&st=sm9rscl0&raw=1";
const pdf34 = "https://www.dropbox.com/scl/fi/2z8oc7dxgf5t0s5r50f9d/APPENDIX-D-VVENDOR-SCORING-TEMPLATE.pdf?rlkey=ypbdqcncqon9kq205sbzwq89j&st=44joy9vm&raw=1";
const pdf35 = "https://www.dropbox.com/scl/fi/odk49ohm2mvosx4lm9083/APPENDIX-E-IT-VENDOR-EXIT-STRATEGY.pdf?rlkey=d1c6r4e7ou6jse2uy0x09bdak&st=2vdjjqdx&raw=1";
const pdf36 = "https://www.dropbox.com/scl/fi/1l2s6satjrnwtyw0m6foy/SOP-1.0.13_IT-VENDOR-MANAGEMENT.pdf?rlkey=297qijs26j7kxd1fp8ltfnkfq&st=y6ioqd6c&raw=1";
const pdf37 = "https://www.dropbox.com/scl/fi/kl1kmu5x3ezfb7v4ekkbw/SOP-1.0.14_IT-INVENTORY-MANAGEMENT-SOP.pdf?rlkey=nv31yd88912eshvbpuzxiixm4&st=8gebn553&raw=1";
const pdf38 = "https://www.dropbox.com/scl/fi/3f86hos1ekyhlaohj1hcl/SOP-1.0.15_IT-Procurement.pdf?rlkey=p6c54a8jea8g3p0mn2hv8k5s7&st=7kdsaiv2&raw=1";
const pdf39 = "https://www.dropbox.com/scl/fi/jhhck37h247fun06e1ifz/SOP-INDEX.pdf?rlkey=lqry34qhenjuvpgdt8jpbk0mn&st=jdli8efj&raw=1";
const pdf40 = "https://www.dropbox.com/scl/fi/tfjatm0z4zh6r8vdskpuw/SOP-Saftey-Security.pdf?rlkey=g8rtgwgqnj8vlig6tup9jd847&st=c8eukv82&raw=1";
const pdf41 = "https://www.dropbox.com/scl/fi/cii4xvvu9y4j2u77ie9ib/APPENDIX-A-Change-Management-Board.pdf?rlkey=vptazav4uqu38vo5us79otsf3&st=n5gogf2s&raw=1";
const pdf42 = "https://www.dropbox.com/scl/fi/3rd1c75sds1dd5953eprs/APPENDIX-B-Change-Advisory-Board.pdf?rlkey=ti1ci240kytkg39wrlk163j0c&st=uf31tnfa&raw=1";
const pdf43 = "https://www.dropbox.com/scl/fi/xjcpyjams1m0wdkd5n0cw/APPENDIX-C-Change-Manager.pdf?rlkey=lvx5ag378buabebbnp42hnhbk&st=qt7x38sm&raw=1";
const pdf44 = "https://www.dropbox.com/scl/fi/ahe7n6sfof14sshrquguq/APPENDIX-D-Change-Request-Submission-Form.pdf?rlkey=wfi7w6hfjxryuf6hp7hrwpse1&st=kwpgq3wo&raw=1";
const pdf45 = "https://www.dropbox.com/scl/fi/evb080islv1mhxuh7cf46/SOP-1.0.8_CHANGE-MANAGEMENT.pdf?rlkey=ng8swloilbav9cmva1uir40yl&st=iv1pmz3a&raw=1";
const pdf46 = "https://www.dropbox.com/scl/fi/meaf30i8xd4rjjc7ya1vu/SOP-1.0.1_ROLES-AND-RESPONSIBILITIES.pdf?rlkey=0r66we45sj1pjyxustz7qrqr8&st=8np5db15&raw=1";

interface Folder {
  name: string;
  pdfs: { name: string; file: string }[];
}

const ITSop: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const folders: Folder[] = [
    { name: "SOP Index", pdfs: [{ name: "SOP Index", file: pdf39 }] },
    {
      name: "Roles and Responsibilities",
      pdfs: [
        { name: "SOP 1.0.1_ROLES AND RESPONSIBILITIES", file: pdf46 },
      ],
    },
    {
      name: "IT Support",
      pdfs: [
        { name: "SOP 1.0.2 IT SUPPORT", file: pdf7 },
        { name: "APPENDIX-A FIRST LEVEL IT SUPPORT", file: pdf1 },
        { name: "APPENDIX-B HARDWARE REQUISITION FORM", file: pdf2 },
        { name: "APPENDIX-C DEVICE PROVISIONING", file: pdf3 },
        { name: "APPENDIX-D ESCLATION MATRIX", file: pdf4 },
        { name: "APPENDIX-E IT HARDWARE REQUEST", file: pdf5 },
        { name: "APPENDIX-F TID FORMAT", file: pdf6 }
        
      ],
    },
    {
      name: "Email User Creation and Deactivation",
      pdfs: [
        { name: "SOP 1.0.3 EMAIL USER CREATION AND DEACTIVATION", file: pdf11 },
        { name: "APPENDIX-A NEW JOINER'S EMAIL ID REQUEST- HR-TO-IT PROCESS FLOW", file: pdf8 },
       { name: "APPENDIX-B EMAIL REQUISITION FORM", file: pdf9 },
      { name: "HR LAPTOP-DESKTOP REQUEST TO IT PROCESS FLOW", file: pdf10 }
       ],
    },
    {
      name: "Email Archiving",
      pdfs: [{ name: "SOP 1.0.4_EMAIL ARCHIVING", file: pdf12 }],
    },
    {
      name: "Network and Infrastructure Management",
      pdfs: [
        { name: "SOP 1.0.5 Network and Infrastructure Management", file: pdf13 },
      ],
    },
    {
      name: "Firewall Configuration",
      pdfs: [{ name: "SOP 1.0.6 FIREWALL CONFIGURATION", file: pdf14 }],
    },
    {
      name: "Network Configuration",
      pdfs: [{ name: "Appendix-A Switch Configuration", file: pdf15 },
        { name: "Network Configuration", file: pdf16 }
      ],
    },
    {
      name: "Change Management",
      pdfs: [
        { name: "SOP 1.0.8_CHANGE MANAGEMENT", file: pdf45 },
        { name: "APPENDIX-A Change Management Board", file: pdf41 },
        { name: "APPENDIX-B Change Advisory Board", file: pdf42 },
        { name: "APPENDIX-C Change Manager", file: pdf43 },
        { name: "APPENDIX-D Change Request Submission Form", file: pdf44 },
        
      ],
    },
    {
      name: "Incident Response",
      pdfs: [{ name: "SOP 1.0.9_INCIDENT RESPONSE", file: pdf19 },
        { name: "APPENDIX0-A INCIDENT RESPONSE TEAM", file: pdf17 },
        { name: "APPENDIX0-B IT DRIVEN BUSINESS APPLICATION LIST", file: pdf18 }
        
      ],
    },
    {
      name: "Data Backup and Recovery",
      pdfs: [
        { name: "SOP 1.0.10_DATA BACKUP AND RECOVERY", file: pdf25 },
        { name: "APPENDIX-A LIST OF STANDALONE SYSTEM", file: pdf20 },
        { name: "APPENDIX-B DATA BACKUP REQUEST FORM", file: pdf21 },
        { name: "APPENDIX-C DATA RESTORE FORM", file: pdf22 },
        { name: "APPENDIX-D QUARTERLY, HALF YEARLY & YEARLY DATA BACKUP RECORD", file: pdf23 },
        { name: "APPENDIX-E  LOGBOOK FOR STANDALONE SYSTEMUSER DATA RETENTION", file: pdf24 },
       

      ],
    },
    {
      name: "IT Access Control",
      pdfs: [
        { name: "SOP 1.0.11_IT ACCESS CONTROL", file: pdf28 },
        { name: "APPENDIX A_USER ACCESS AUTHORIZATION FORM", file: pdf26 },
        { name: "IT ACCESS CONTROL POLICY", file: pdf27 }
        
      ],
    },
    {
      name: "IT Asset Management",
      pdfs: [
        { name: "SOP 1.0.12_IT ASSET MANAGEMENT", file: pdf32 },
        { name: "APPENDIX-A_Fixed Asset Policy", file: pdf29 },
        { name: "APPENDIX-B_IT Policy Device and Reimbursement", file: pdf30 },
        { name: "APPENDIX-C Vendor RFP Template", file: pdf31 },
        
      ],
    },
    {
      name: "IT Vendor Management",
      pdfs: [
        { name: "SOP 1.0.13_IT VENDOR MANAGEMENT", file: pdf36 },
        { name: "APPENDIX-C VENDOR RFP TEMPLATE", file: pdf33 },
        { name: "APPENDIX-D VVENDOR SCORING TEMPLAT", file: pdf34 },
        { name: "APPENDIX-E IT VENDOR EXIT STRATEGY", file: pdf35 },
        
      ],
    },
    {
      name: "IT Inventory Management",
      pdfs: [{ name: "SOP 1.0.14_IT INVENTORY MANAGEMENT SOP", file: pdf37 }],
    },
    {
      name: "IT Procurement (Approved)",
      pdfs: [{ name: "SOP 1.0.15_IT Procurement (Approved)", file: pdf38 }],
    },
    {
      name: "SOP Safety & Security",
      pdfs: [{ name: "SOP Saftey & Security", file: pdf40 }],
    },
  ];

  const openPopup = (pdf: string) => {
    setSelectedPdf(pdf);
    setTimeout(() => setIsPopupVisible(true), 10);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setTimeout(() => setSelectedPdf(null), 300);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Horizontal folder list with hover-activated scrollbar */}
      <div
        className="folder-list"
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "10px",
          gap: "10px",
          backgroundColor: "#f7f7f7",
          borderBottom: "1px solid #ccc",
          justifyContent: "flex-start", // Align items to the start
        }}
      >
        <style>
          {`
            .folder-list {
              scrollbar-width: thin;
              scrollbar-color: transparent transparent; /* Firefox */
            }
            .folder-list::-webkit-scrollbar {
              height: 8px;
              background-color: transparent; /* Default background */
            }
            .folder-list::-webkit-scrollbar-thumb {
              background-color: transparent; /* Invisible thumb */
            }
            .folder-list:hover {
              scrollbar-color: rgba(0, 0, 0, 0.3) rgba(0, 0, 0, 0); /* Visible on hover */
            }
            .folder-list:hover::-webkit-scrollbar-thumb {
              background-color: rgba(0, 0, 0, 0.3); /* Visible thumb color on hover */
            }
            .folder-card { transition: background-color 0.3s, transform 0.3s; }
            .folder-card:hover { background-color: #e0e0e0; transform: scale(1.03); }
            .pdf-card { transition: background-color 0.3s, transform 0.3s; }
            .pdf-card:hover { background-color: #f0f0f0; transform: scale(1.03); }
          `}
        </style>
        {folders.map((folder) => (
          <button
            key={folder.name}
            onClick={() => setSelectedFolder(folder)}
            className="folder-card"
            style={{
              minWidth: "120px",
              padding: "10px",
              backgroundColor: "#ffffff",
              border: "1px solid #ccc",
              borderRadius: "8px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}
          >
            <FaFolder
              size={35}
              color="#ffcc00"
              style={{ marginBottom: "10px" }}
            />
            <span
              style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}
            >
              {folder.name}
            </span>
          </button>
        ))}
      </div>

      {/* Right-side view for files in selected folder */}
      <section
        style={{
          flex: 1,
          padding: "20px",
          backgroundColor: "#ffffff",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
        }}
      >
        <h3 style={{ color: "#333", marginBottom: "10px" }}>
          Files in {selectedFolder?.name || "..."}
        </h3>
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {selectedFolder?.pdfs.map((pdf) => (
            <div
              key={pdf.name}
              style={{ minWidth: "120px", maxWidth: "150px" }}
            >
              <button
                onClick={() => openPopup(pdf.file)}
                className="pdf-card"
                style={{
                  width: "100%",
                  padding: "15px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  backgroundColor: "#f5f5f5",
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  cursor: "pointer",
                  transition: "background-color 0.3s, transform 0.3s",
                }}
              >
                <FaFilePdf
                  size={30}
                  color="#ff6f61"
                  style={{ marginBottom: "10px" }}
                />
                <span
                  style={{
                    color: "#333",
                    fontSize: "13px",
                    textAlign: "center",
                  }}
                >
                  {pdf.name}
                </span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Modern Popup PDF Viewer */}
      {selectedPdf && (
        <div
          onClick={closePopup}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: isPopupVisible ? 1 : 0,
            transform: isPopupVisible ? "scale(1)" : "scale(0.9)",
            filter: isPopupVisible ? "blur(0)" : "blur(8px)",
            transition:
              "opacity 0.4s ease, transform 0.4s ease, filter 0.4s ease",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "80%",
              height: "80%",
              backgroundColor: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              position: "relative",
            }}
          >
            <iframe
              src={selectedPdf}
              style={{
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "0 0 12px 12px",
              }}
              title="PDF Viewer"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default ITSop;
