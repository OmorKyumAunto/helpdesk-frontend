import { Col, Form, Select } from "antd";
import { NamePath } from "antd/es/form/interface";
// import { useGetServiceQuery } from "../../modules/Configuration/Service/api/serviceEndPoint";
import { commonProps } from "../../common/types/CommonTypes";

type CommonProps = {
  name: NamePath;
  label: string;
  size?: number;
  required?: boolean;
  disabled?: boolean;
  setAccountCategoryID?: (arg: number) => void;
  setAccountLastBalance?: (arg: number) => void;
  handleCategoryChange?: (arg: number) => void;
  setAccountId?: (arg: number) => void;
  accountCategoryID?: number;
};

export const SelectProductCategory = ({
  name,
  label,
  size,
  required,
  disabled,
  setAccountCategoryID,
  handleCategoryChange,
  setAccountId,
}: CommonProps) => {
  // ================= account category
  // const { data: accountCategory } = useGetAllAccountCategoryQuery();
  // const selectAccountCategory = accountCategory?.data;
  const accountCategoryChildren: React.ReactNode[] = [];
  // if (selectAccountCategory) {
  //   for (let i = 0; i < selectAccountCategory.length; i++) {
  //     accountCategoryChildren.push(
  //       <Select.Option
  //         key={selectAccountCategory[i].cat_start_from}
  //         value={selectAccountCategory[i].cat_start_from}
  //       >
  //         {`${selectAccountCategory[i].cat_name} [${selectAccountCategory[i].cat_start_from}]`}
  //       </Select.Option>
  //     );
  //   }
  // }
  return (
    <Col span={6} xs={24} sm={12} md={12} lg={size ? size : 12}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: required, message: `${label} is required` }]}
      >
        <Select
          disabled={disabled}
          placeholder="Select Product Category"
          showSearch
          style={{ padding: "0", margin: "0", border: "0" }}
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onSelect={(e: number) =>
            setAccountCategoryID && setAccountCategoryID(e)
          }
        >
          {accountCategoryChildren}
        </Select>
      </Form.Item>
    </Col>
  );
};
export const SelectAccountCategoy = ({
  name,
  label,
  size,
  required,
  disabled,
  setAccountCategoryID,
  setAccountId,
}: CommonProps) => {
  // ================= account category
  // const { data: accountCategory } = useGetAllAccountCategoryQuery();
  // const selectAccountCategory = accountCategory?.data;
  const accountCategoryChildren: React.ReactNode[] = [];
  // if (selectAccountCategory) {
  //   for (let i = 0; i < selectAccountCategory.length; i++) {
  //     accountCategoryChildren.push(
  //       <Select.Option
  //         key={selectAccountCategory[i].cat_start_from}
  //         value={selectAccountCategory[i].cat_start_from}
  //       >
  //         {`${selectAccountCategory[i].cat_name} [${selectAccountCategory[i].cat_start_from}]`}
  //       </Select.Option>
  //     );
  //   }
  // }
  return (
    <Col span={6} xs={24} sm={12} md={12} lg={size ? size : 12}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: required, message: `${label} is required` }]}
      >
        <Select
          disabled={disabled}
          placeholder="Select Product Category"
          showSearch
          style={{ padding: "0", margin: "0", border: "0" }}
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onSelect={(e: number) =>
            setAccountCategoryID && setAccountCategoryID(e)
          }
        >
          {accountCategoryChildren}
        </Select>
      </Form.Item>
    </Col>
  );
};

type SelectProps = {
  name: NamePath;
  label: string;
  size?: number;
  required?: boolean;
  disabled?: boolean;
  setAccountId?: (arg: number) => void;
  data?: any[];
  allowClear?: boolean;
};
export const SelectAccount = ({
  name,
  label,
  size,
  required,
  disabled,
  setAccountId,
  data,
  allowClear,
}: SelectProps) => {
  // ================= account
  const accountsChildren: React.ReactNode[] = [];
  if (data) {
    for (let i = 0; i < data.length; i++) {
      accountsChildren.push(
        <Select.Option key={data[i].id} value={data[i].id}>
          {`${data[i].name} [${data[i].account_no}]`}
        </Select.Option>
      );
    }
  }
  return (
    <Col xs={24} sm={24} md={12} lg={size ? size : 8}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: required, message: `${label} is required` }]}
      >
        <Select
          allowClear={allowClear}
          disabled={disabled}
          placeholder="Select Account"
          showSearch
          style={{ padding: "0", margin: "0", border: "0" }}
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          onSelect={(e: number) => setAccountId && setAccountId(e)}
        >
          {accountsChildren}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const SelectLeafAccountByCategoryID = ({
  name,
  label,
  size,
  required,
  disabled,
  accountCategoryID,
  setAccountLastBalance,
}: CommonProps) => {
  // ================= account
  // const [fetchAccounts, { data: accounts }] =
  //   useLazyGetAllLeafAccountsByIDQuery();
  // const [accountID, setAccountID] = useState<string>();
  // const [accountDetails, setAccountDetails] =
  //   useState<IAccountsSngleDataType[]>();

  // console.log({ accounts });

  // useEffect(() => {
  //   if (accountCategoryID) {
  //     fetchAccounts(accountCategoryID);
  //   }
  // }, [accountCategoryID, fetchAccounts]);

  // useEffect(() => {
  //   setAccountDetails(
  //     accounts?.data?.filter((item) => {
  //       return String(item.acc_id) === accountID;
  //     })
  //   );
  // }, [accounts?.data, accountID]);

  // useEffect(() => {
  //   setAccountLastBalance &&
  //     accountDetails?.length &&
  //     setAccountLastBalance(Number(accountDetails[0].acc_balance));
  // }, [accountDetails, setAccountLastBalance]);

  // const selectAccounts = accounts?.data;

  // const accountsChildren: React.ReactNode[] = [];
  // if (selectAccounts) {
  //   for (let i = 0; i < selectAccounts.length; i++) {
  //     accountsChildren.push(
  //       <Select.Option
  //         key={selectAccounts[i].acc_id}
  //         value={selectAccounts[i].acc_id}
  //       >
  //         {`${selectAccounts[i].acc_name} [${selectAccounts[i].acc_id}]`}
  //       </Select.Option>
  //     );
  //   }
  // }
  return (
    <Col span={6} xs={24} sm={24} md={24} lg={size ? size : 8}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: required, message: `${label} is required` }]}
      >
        <Select
          disabled={disabled}
          placeholder="Select Account"
          showSearch
          style={{ padding: "0", margin: "0", border: "0" }}
          onSelect={(e: string) => {
            // setAccountID(e);
          }}
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {/* {accountsChildren} */}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const SelectParentAccountByCategoryID = ({
  name,
  label,
  size,
  required,
  disabled,
  accountCategoryID,
  setAccountLastBalance,
}: CommonProps) => {
  // ================= account
  // const [fetchAccounts, { data: accounts }] =
  //   useLazyGetAllParentAccountsByIDQuery();
  // const [accountID, setAccountID] = useState<string>();
  // const [accountDetails, setAccountDetails] =
  //   useState<IAccountsSngleDataType[]>();

  // console.log({ accountCategoryID });

  // useEffect(() => {
  //   if (accountCategoryID) {
  //     fetchAccounts(accountCategoryID);
  //   }
  // }, [accountCategoryID, fetchAccounts]);

  // useEffect(() => {
  //   setAccountDetails(
  //     accounts?.data?.filter((item) => {
  //       return String(item.acc_id) === accountID;
  //     })
  //   );
  // }, [accounts?.data, accountID]);

  // useEffect(() => {
  //   setAccountLastBalance &&
  //     accountDetails?.length &&
  //     setAccountLastBalance(Number(accountDetails[0].acc_balance));
  // }, [accountDetails, setAccountLastBalance]);

  // const selectAccounts = accounts?.data;
  // console.log(selectAccounts);

  // const accountsChildren: React.ReactNode[] = [];
  // if (selectAccounts) {
  //   for (let i = 0; i < selectAccounts.length; i++) {
  //     accountsChildren.push(
  //       <Select.Option
  //         key={selectAccounts[i].acc_id}
  //         value={selectAccounts[i].acc_id}
  //       >
  //         {`${selectAccounts[i].acc_name} [${selectAccounts[i].acc_id}]`}
  //       </Select.Option>
  //     );
  //   }
  // }
  return (
    <Col span={6} xs={24} sm={24} md={24} lg={size ? size : 8}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: required, message: `${label} is required` }]}
      >
        <Select
          disabled={disabled}
          placeholder="Select Account"
          showSearch
          style={{ padding: "0", margin: "0", border: "0" }}
          onSelect={(e: string) => {
            // setAccountID(e);
          }}
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
        >
          {/* {accountsChildren} */}
        </Select>
      </Form.Item>
    </Col>
  );
};

export const SelectTransactionType = ({
  name,
  label,
  size,
  required,
  disabled,
}: CommonProps) => {
  // ================= transaction

  return (
    <Col span={6} xs={24} sm={24} md={24} lg={size ? size : 8}>
      <Form.Item
        name={name}
        label={label}
        rules={[{ required: required, message: `${label} is required` }]}
      >
        <Select
          disabled={disabled}
          placeholder="Select Account"
          showSearch
          style={{ padding: "0", margin: "0", border: "0" }}
          filterOption={(input, option) =>
            (option!.children as unknown as string)
              .toLowerCase()
              .includes(input.toLowerCase())
          }
          //   onSelect={(e: number) =>
          //     setAccountCategoryID && setAccountCategoryID(e)
          //   }
        >
          <Select.Option key={1} value="dr">
            {"Debit"}
          </Select.Option>
          <Select.Option key={2} value="cr">
            {"Credit"}
          </Select.Option>
        </Select>
      </Form.Item>
    </Col>
  );
};

// export const SelectService = ({ name, label, required }: commonProps) => {
//   const { data: service } = useGetServiceQuery({});

//   const selectService = service?.data;
//   const serviceChildren: React.ReactNode[] = [];
//   if (selectService) {
//     for (let i = 0; i < selectService.length; i++) {
//       serviceChildren.push(
//         <Select.Option
//           title="Select Service"
//           key={selectService[i].id + " " + selectService[i].name}
//           value={selectService[i].id}
//         >
//           {selectService[i].name}
//         </Select.Option>
//       );
//     }
//   }

//   return (
//     <Form.Item
//       name={name}
//       label={label}
//       rules={[
//         {
//           required: required || false,
//           message: `${label} is required!`,
//         },
//       ]}
//     >
//       <Select
//         placeholder={"Select Service"}
//         showSearch
//         allowClear
//         style={{ padding: "0", margin: "0", border: "0", width: "100%" }}
//         optionFilterProp="roleMobile"
//         filterOption={(input, option) =>
//           (option!.children as unknown as string).includes(input.toLowerCase())
//         }
//       >
//         {serviceChildren}
//       </Select>
//     </Form.Item>
//   );
// };
