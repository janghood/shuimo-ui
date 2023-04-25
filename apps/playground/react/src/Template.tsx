/**
 * @description
 * @author 阿怪
 * @date 2023/4/24 18:02
 * @version v1.0.0
 *
 * 江湖的业务千篇一律，复杂的代码好几百行。
 */
import { MTable,MTableColumn } from '@shuimo-design/react/index';
export default function Other(){

  const data = [
    { id: 1, param: '立春' },
    { id: 2, param: '雨水' },
    { id: 3, param: '惊蛰' },
    { id: 4, param: '春分' },
    { id: 5, param: '清明' },
    { id: 6, param: '谷雨' },
    { id: 7, param: '立夏、小满、芒种、夏至、小暑、大暑、立秋、处暑、白露、秋分、寒露、霜降、立冬、小雪、大雪、冬至、小寒、大寒' },
  ]

  const table = <div className="table">
    <MTable data={data} height="350px">
      <MTableColumn width="80px" param="id" label="序号"/>
      <MTableColumn param="param" label="参数"/>
      <MTableColumn param="option" label="操作"></MTableColumn>
    </MTable>
  </div>

  return <div className="flex">
    {table}
  </div>
}