<template>
    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" v-model="open" width="680px" append-to-body>
        <el-form ref="editRef" :model="form" :rules="rules" label-width="100px">
            <el-row>
                <el-col :span="24">
                    <el-form-item label="上级菜单">
                        <el-tree-select v-model="form.parentId" :data="menuOptions"
                            :props="{ value: 'menuId', label: 'menuName', children: 'children' }" value-key="menuId"
                            placeholder="选择上级菜单" check-strictly />
                    </el-form-item>
                </el-col>
                <el-col :span="24">
                    <el-form-item label="菜单类型" prop="menuType">
                        <el-radio-group v-model="form.menuType">
                            <el-radio value="M">{{ $t('menu.d.type.m') }}</el-radio>
                            <el-radio value="C">{{ $t('menu.d.type.c') }}</el-radio>
                            <el-radio value="F">{{ $t('menu.d.type.f') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="24" v-if="form.menuType != 'F'">
                    <el-form-item label="菜单图标" prop="icon">
                        <el-popover placement="bottom-start" :width="540" v-model:visible="showChooseIcon"
                            trigger="click" @show="showSelectIcon">
                            <template #reference>
                                <el-input v-model="form.icon" placeholder="点击选择图标" @blur="showSelectIcon"
                                    v-click-outside="hideSelectIcon" readonly>
                                    <template #prefix>
                                        <svg-icon v-if="form.icon" :icon-class="form.icon" class="el-input__icon"
                                            style="height: 32px;width: 16px;" />
                                        <el-icon v-else style="height: 32px;width: 16px;">
                                            <search />
                                        </el-icon>
                                    </template>
                                </el-input>
                            </template>
                            <icon-select ref="iconSelectRef" @selected="selected" :active-icon="form.icon" />
                        </el-popover>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="菜单名称" prop="menuName">
                        <el-input v-model="form.menuName" placeholder="请输入菜单名称" />
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="显示排序" prop="orderNum">
                        <el-input-number v-model="form.orderNum" controls-position="right" :min="0" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                    <el-form-item>
                        <template #label>
                            <span>
                                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>是否外链
                            </span>
                        </template>
                        <el-radio-group v-model="form.isFrame">
                            <el-radio value="0">{{ $t('dict.whether.0') }}</el-radio>
                            <el-radio value="1">{{ $t('dict.whether.1') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                    <el-form-item prop="path">
                        <template #label>
                            <span>
                                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>
                                路由地址
                            </span>
                        </template>
                        <el-input v-model="form.path" placeholder="请输入路由地址" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType == 'C'">
                    <el-form-item prop="component">
                        <template #label>
                            <span>
                                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>
                                组件路径
                            </span>
                        </template>
                        <el-input v-model="form.component" placeholder="请输入组件路径" />
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'M'">
                    <el-form-item>
                        <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100" />
                        <template #label>
                            <span>
                                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermi('system:user:list')`)"
                                    placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>
                                权限字符
                            </span>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType == 'C'">
                    <el-form-item>
                        <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255" />
                        <template #label>
                            <span>
                                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>
                                路由参数
                            </span>
                        </template>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType == 'C'">
                    <el-form-item>
                        <template #label>
                            <span>
                                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>
                                是否缓存
                            </span>
                        </template>
                        <el-radio-group v-model="form.isCache">
                            <el-radio value="0">{{ $t('dict.whether.0') }}</el-radio>
                            <el-radio value="1">{{ $t('dict.whether.1') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                    <el-form-item>
                        <template #label>
                            <span>
                                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>
                                显示状态
                            </span>
                        </template>
                        <el-radio-group v-model="form.visible">
                            <el-radio value="1">{{ $t('menu.d.showHide.0') }}</el-radio>
                            <el-radio value="0">{{ $t('menu.d.showHide.1') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="form.menuType != 'F'">
                    <el-form-item>
                        <template #label>
                            <span>
                                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                                    <el-icon><question-filled /></el-icon>
                                </el-tooltip>
                                菜单状态
                            </span>
                        </template>
                        <el-radio-group v-model="form.status">
                            <el-radio value="1">{{ $t('dict.disable.0') }}</el-radio>
                            <el-radio value="0">{{ $t('dict.disable.1') }}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="submitForm">确 定</el-button>
                <el-button @click="cancel">取 消</el-button>
            </div>
        </template>
    </el-dialog>
</template>
<script setup name="edit">
import { ref } from 'vue';
import IconSelect from "@/components/IconSelect";
import { ClickOutside as vClickOutside } from 'element-plus'
import { addMenu, getMenu, listMenu, updateMenu } from "@/api/system/menu";

const { proxy } = getCurrentInstance();
const emits = defineEmits(["onClose"])

const showChooseIcon = ref(false);
const iconSelectRef = ref(null);
const title = ref("");
const menuOptions = ref([]);

let open = ref(false)
let form = ref({})
const rules = {
    menuName: [{ required: true, message: "菜单名称不能为空", trigger: "blur" }],
    orderNum: [{ required: true, message: "菜单顺序不能为空", trigger: "blur" }],
    path: [{ required: true, message: "路由地址不能为空", trigger: "blur" }]
}
/** 查询菜单下拉树结构 */
function getTreeselect() {
   menuOptions.value = [];
   listMenu({isMenu:true}).then(res => {
      const menu = { menuId: 0, menuName: "主类目", children: [] };
      menu.children = proxy.handleTree(res, "menuId");
      menuOptions.value.push(menu);
   });
}
/** 取消按钮 */
function cancel() {
   open.value = false;
   reset();
}
/** 表单重置 */
function reset() {
   form.value = {
      menuId: undefined,
      parentId: 0,
      menuName: undefined,
      icon: undefined,
      menuType: "M",
      orderNum: undefined,
      isFrame: "1",
      isCache: "0",
      visible: "0",
      status: "0"
   };
   proxy.resetForm("menuRef");
}
/** 展示下拉图标 */
function showSelectIcon() {
   iconSelectRef.value.reset();
   showChooseIcon.value = true;
}
/** 选择图标 */
function selected(name) {
   form.value.icon = name;
   showChooseIcon.value = false;
}
/** 图标外层点击隐藏下拉列表 */
function hideSelectIcon(event) {
   var elem = event.relatedTarget || event.srcElement || event.target || event.currentTarget;
   var className = elem.className;
   if (className !== "el-input__inner") {
      showChooseIcon.value = false;
   }
}
/** 新增按钮操作 */
function handleAdd(row) {
   reset();
   getTreeselect();
   if (row != null && row.menuId) {
      form.value.parentId = row.menuId;
   } else {
      form.value.parentId = 0;
   }
   open.value = true;
   title.value = "添加菜单";
}
/** 修改按钮操作 */
async function handleUpdate(row) {
   reset();
   await getTreeselect();
   getMenu(row.menuId).then(response => {
      form.value = response;
      open.value = true;
      title.value = "修改菜单";
   });
}
/** 提交按钮 */
function submitForm() {
   proxy.$refs["editRef"].validate(valid => {
      if (valid) {
         if (form.value.menuId != undefined) {
            updateMenu(form.value).then(response => {
               proxy.$modal.msgSuccess("修改成功");
               open.value = false;
               emits("onClose")
            });
         } else {
            addMenu(form.value).then(response => {
               proxy.$modal.msgSuccess("新增成功");
               open.value = false;
               emits("onClose")
            });
         }
      }
   });
}
defineExpose({
    handleAdd,
    handleUpdate
})
</script>