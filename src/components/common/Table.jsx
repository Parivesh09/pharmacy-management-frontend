import Input from './Input';

export default function TableView ({onChange}){


    return(
        <tbody>
        <tr className="border-b border-gray-200 hover:bg-gray-50">
          <td className="px-1  border-r border-gray-200">
            <Input
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs"
              onChange={onChange}
            />
          </td>
          <td className="px-1  border-r border-gray-200">
            <Input
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs"
              onChange={onChange}
              
            />
          </td>
          <td className="px-1 py-1 border-r border-gray-200">
            <Input
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs"
              onChange={onChange}
             
            />
          </td>
          <td className="px-1 py-1 border-r border-gray-200">
            <Input
              type="text"
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs"
              onChange={onChange}
              
            />
          </td>
          <td className="px-1 py-1 border-r border-gray-200">
            <Input
              type="number"
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs text-center"
              onChange={onChange}
             
            />
          </td>
          <td className="px-1 py-1 border-r border-gray-200">
            <Input
              type="number"
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs text-center"
              onChange={onChange}
             
            />
          </td>
          <td className="px-1 py-1 border-r border-gray-200">
            <Input
              type="number"
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs text-right"
              onChange={onChange}
             
            />
          </td>
          <td className="px-1 py-1 border-r border-gray-200">
            <Input
              type="number"
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none text-xs text-center"
              onChange={onChange}
             
            />
          </td>
          <td className="px-1 py-1 border-r border-gray-200">
            <Input
              type="number"
              className="w-full px-1 py-1 border-0 focus:ring-0 focus:outline-none bg-gray-50 text-xs text-right font-medium"
              onChange={onChange}
            />
          </td>
        </tr>
      </tbody>
    );
}