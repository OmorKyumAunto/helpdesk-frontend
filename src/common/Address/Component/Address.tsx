/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

import { FormSelect } from "../../formItem/FormItems";
import {
  useGetAreaQuery,
  useGetDistrictQuery,
  useGetDivisionQuery,
  useGetThanaQuery,
} from "../api/addressEndPoint";

type TProps = {
  // handleAddedOnSelect: (type: string, event: string) => void;
  companyDetails?: any;
  setLocation?: any;
  location?: any;
};

const Address = ({ companyDetails, setLocation, location }: TProps) => {
  // get address data
  const { data: divisionData } = useGetDivisionQuery();
  // console.log(divisionData)
  const { data: districtData } = useGetDistrictQuery({
    division_id: location.division,
  });
  const { data: thanaData } = useGetThanaQuery({
    division_id: location.division,
    district_id: location.district,
  });
  const { data: areaData } = useGetAreaQuery({
    thana_id: location.thana,
  });

  // useEffect(() => {
  //   if (companyDetails) {
  //     setLocation({
  //       division: companyDetails.divisionId,
  //       district: companyDetails.districtId,
  //       thana: companyDetails.thanaId,
  //     });
  //   }
  // }, [
  //   companyDetails.divisionId,
  //   companyDetails.districtId,
  //   companyDetails.thanaId,
  // ]);

  // useEffect(() => {
  //   if (companyDetails.divisionId !== location.division) {
  //   }
  // }, [location.division]);

  return (
    <>
      <FormSelect
        name={"division"}
        size={6}
        label="Division"
        required
        onClear={() => {
          setLocation({ ...location, division: 0 });
        }}
        onSelect={(e: number) => setLocation({ ...location, division: e })}
        placeholder="Select division"
        rules={[{ required: true }]}
        data={
          divisionData?.data &&
          divisionData?.data.map((division) => {
            return {
              value: division.division_id,
              label: division.division_name,
            };
          })
        }
      />
      <FormSelect
        name={"district"}
        size={6}
        label="District"
        required
        disabled={!location.division}
        onClear={() => {
          setLocation({ ...location, district: 0 });
        }}
        onSelect={(e: number) => setLocation({ ...location, district: e })}
        placeholder="District"
        rules={[{ required: true }]}
        data={
          districtData?.data &&
          districtData?.data.map((district) => {
            return {
              value: district.district_id,
              label: district.district_name,
            };
          })
        }
      />
      <FormSelect
        name={"thana"}
        size={6}
        label="Thana"
        required
        onClear={() => {
          setLocation({ ...location, thana: 0 });
        }}
        disabled={!location.division || !location.district}
        onSelect={(e: number) => setLocation({ ...location, thana: e })}
        placeholder="District"
        rules={[{ required: true }]}
        data={
          thanaData?.data &&
          thanaData?.data.map((thana) => {
            return {
              value: thana.thana_id,
              label: thana.thana_name,
            };
          })
        }
      />
      <FormSelect
        name={"area_id"}
        size={6}
        label="Area"
        required
        disabled={!location.division || !location.district || !location.thana}
        placeholder="Area"
        rules={[{ required: true }]}
        data={
          areaData?.data &&
          areaData?.data.map((area) => {
            return {
              value: area.area_id,
              label: area.area_name,
            };
          })
        }
      />
    </>
  );
};

export default Address;
