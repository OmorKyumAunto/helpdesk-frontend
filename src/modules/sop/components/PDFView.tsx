import { Card } from "antd";
import { useState } from "react";
import { FaRegFilePdf } from "react-icons/fa6";

const PDFView = ({ pdf }) => {
  const [PDFPath, setPDFPath] = useState(null);
  return (
    <Card>
      <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mb-10">
        {pdf?.map((item) => (
          <div key={item?.id}>
            <div
              className="border border-solid border-gray-300 flex justify-center items-center p-5 shadow-md cursor-pointer w-full h-full"
              onClick={() => setPDFPath(item.path)}
            >
              <div className="w-full">
                <div className="flex justify-center mb-2">
                  <FaRegFilePdf size={56} />
                </div>
                <p className="text-center">{item.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center items-center ">
        {PDFPath && (
          <iframe
            className="border border-solid border-gray-400"
            src={PDFPath}
            width={"90%"}
            height={600}
            frameBorder="0"
          ></iframe>
        )}
      </div>
    </Card>
  );
};

export default PDFView;
