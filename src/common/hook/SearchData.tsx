import { Button, Space, InputRef } from 'antd';
import { ColumnType, FilterConfirmProps } from 'antd/lib/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Input from 'antd/lib/input/Input';
import { useRef, useState } from 'react';

function useGetSearchColumnProps<ColumnDataType>() {
  return function (
    dataIndex: keyof ColumnDataType
  ): ColumnType<ColumnDataType> {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] =
      useState<keyof ColumnDataType>();
    const searchInput = useRef<InputRef>(null);

    const handleSearch = (
      selectedKeys: string[],
      confirm: (param?: FilterConfirmProps) => void,
      dataIndex: keyof ColumnDataType
    ) => {
      confirm();
      setSearchText(selectedKeys[0]);
      setSearchedColumn(dataIndex);
    };

    const handleReset = (clearFilters: () => void) => {
      clearFilters();
      setSearchText('');
    };

    return {
      filterDropdown: ({
        setSelectedKeys,
        selectedKeys,
        confirm,
        clearFilters,
      }) => (
        <div style={{ padding: 8 }}>
          <Input
            ref={searchInput}
            placeholder={`Search ${String(dataIndex)}`}
            value={selectedKeys[0]}
            onChange={(e) =>
              setSelectedKeys(e.target.value ? [e.target.value] : [])
            }
            onPressEnter={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            style={{ marginBottom: 8, display: 'block' }}
          />
          <Space>
            <Button
              type='primary'
              onClick={() =>
                handleSearch(selectedKeys as string[], confirm, dataIndex)
              }
              icon={<SearchOutlined />}
              size='small'
              style={{ width: 90 }}
            >
              Search
            </Button>
            <Button
              onClick={() => clearFilters && handleReset(clearFilters)}
              size='small'
              style={{ width: 90 }}
            >
              Reset
            </Button>
            <Button
              type='link'
              size='small'
              onClick={() => {
                confirm({ closeDropdown: false });
                setSearchText((selectedKeys as string[])[0]);
                setSearchedColumn(dataIndex);
              }}
            >
              Filter
            </Button>
          </Space>
        </div>
      ),
      filterIcon: (filtered: boolean) => (
        <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />
      ),

      onFilter: (value, record) => {
        const recordValue = record[dataIndex] as unknown as string | number;

        if (!recordValue) {
          return false;
        }

        return recordValue
          .toString()
          .toLowerCase()
          .includes((value as string).toLowerCase());
      },
      onFilterDropdownOpenChange: (visible) => {
        if (visible) {
          setTimeout(() => searchInput.current?.select(), 100);
        }
      },

      render: (text) =>
        searchedColumn === dataIndex ? (
          //   <Highlighter
          //     highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          //     searchWords={[searchText]}
          //     autoEscape
          //     textToHighlight={text ? text.toString() : ''}
          //   />
          <></>
        ) : (
          text
        ),
    };
  };
}

export default useGetSearchColumnProps;
