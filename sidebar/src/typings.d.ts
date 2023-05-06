interface INode {
  label: string,
  children: INode[]
}

interface IData {
  group: string,
  label: string,
  id: number,
  isParent: boolean,
  parentId: number | null,
  parent: string | null
}

interface IDataMeta {
  data: IData[]
}
