import request from '@/utils/request'
/**
 * 保存或新增菜单
 * @param data
 */
export const createOrUpdateMenu = (data: object) => {
  return request({
    method: 'POST',
    url: '/boss/menu/saveOrUpdate',
    data
  })
}

/**
 * 获取编辑菜单页面信息
 * @param id 菜单id 默认值为-1代表添加菜单 值不为-1则是编辑
 * id 指定为一个联合类型
 */
export const getEditMenuInfo = (id: string | number = -1) => {
  return request({
    method: 'GET',
    // url: '/boss/menu/getEditMenuInfo?id=' + id
    url: '/boss/menu/getEditMenuInfo',
    // 或者通过params来传递，axios自动会把这个对象转成key=value并拼接到URL上
    params: { id }
  })
}

/**
 * 获取所有菜单列表
 */
export const getAllMenu = () => {
  return request({
    method: 'GET',
    url: '/boss/menu/getAll'
  })
}

/**
 * 删除菜单
 * @param id 菜单id
 */
export const deleteMenu = (id: number) => {
  return request({
    method: 'DELETE',
    url: `/boss/menu/${id}`
  })
}
