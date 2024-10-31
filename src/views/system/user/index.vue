<template>
   <div class="app-container">
      <el-row :gutter="20">
         <!--部门数据-->
         <el-col :span="4" :xs="24">
            <div class="head-container">
               <el-input v-model="deptName" placeholder="请输入部门名称" clearable prefix-icon="Search"
                  style="margin-bottom: 20px" />
            </div>
            <div class="head-container">
               <el-tree :data="deptOptions" :props="{ label: 'label', children: 'children' }"
                  :expand-on-click-node="false" :filter-node-method="filterNode" ref="deptTreeRef" node-key="id"
                  highlight-current default-expand-all @node-click="handleNodeClick" />
            </div>
         </el-col>
         <!--用户数据-->
         <el-col :span="20" :xs="24">
            <el-form :model="queryParams" ref="queryRef" :inline="true" v-show="showSearch">
               <el-form-item label="用户账户" prop="userName">
                  <el-input v-model="queryParams.userName" :placeholder="$t('user.v.userName')" clearable
                     style="width: 240px" @keyup.enter="handleQuery" />
               </el-form-item>
               <el-form-item :label="$t('user.t.phonenumber')" prop="phonenumber">
                  <el-input v-model="queryParams.phonenumber" :placeholder="$t('user.v.phonenumber')" clearable
                     style="width: 240px" @keyup.enter="handleQuery" />
               </el-form-item>
               <el-form-item :label="$t('public.status')" prop="status">
                  <el-select v-model="queryParams.status" :placeholder="$t('public.v.select')" clearable
                     style="width: 240px">
                     <el-option :label="$t('dict.disable.0')" :value="'1'" />
                     <el-option :label="$t('dict.disable.1')" :value="'0'" />
                  </el-select>
               </el-form-item>
               <el-form-item :label="$t('public.createdTime')" style="width: 308px;">
                  <el-date-picker v-model="dateRange" value-format="YYYY-MM-DD" type="daterange" range-separator="-"
                     :start-placeholder="$t('public.startDate')"
                     :end-placeholder="$t('public.endDate')"></el-date-picker>
               </el-form-item>
               <el-form-item>
                  <el-button type="primary" icon="Search" @click="handleQuery">{{ $t('public.search') }}</el-button>
                  <el-button icon="Refresh" @click="resetQuery">{{ $t('public.resetting') }}</el-button>
               </el-form-item>
            </el-form>

            <el-row :gutter="10" class="mb8">
               <el-col :span="1.5">
                  <el-button type="primary" plain icon="Plus" @click="handleAdd" v-hasPermi="['system:user:add']">{{
                     $t('public.add') }}</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate"
                     v-hasPermi="['system:user:edit']">{{ $t('public.modify') }}</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete"
                     v-hasPermi="['system:user:remove']">{{ $t('public.delete') }}</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="info" plain icon="Upload" @click="handleImport"
                     v-hasPermi="['system:user:import']">{{ $t('public.import') }}</el-button>
               </el-col>
               <el-col :span="1.5">
                  <el-button type="warning" plain icon="Download" @click="handleExport"
                     v-hasPermi="['system:user:export']">{{ $t('public.export') }}</el-button>
               </el-col>
               <right-toolbar v-model:showSearch="showSearch" @queryTable="getList" :columns="columns"></right-toolbar>
            </el-row>

            <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
               <template #empty>
                  <el-empty description="No Data" />
               </template>
               <el-table-column type="selection" width="50" align="center" />
               <el-table-column :label="$t('user.t.userId')" align="center" key="userId" prop="userId"
                  v-if="columns[0].visible" />
               <el-table-column label="用户账户" align="center" key="userName" prop="userName"
                  v-if="columns[1].visible" :show-overflow-tooltip="true" />
               <el-table-column :label="$t('user.t.nickName')" align="center" key="nickName" prop="nickName"
                  v-if="columns[2].visible" :show-overflow-tooltip="true" />
               <el-table-column :label="$t('user.t.deptName')" align="center" key="deptName" prop="dept.deptName"
                  v-if="columns[3].visible" :show-overflow-tooltip="true" />
               <el-table-column :label="$t('user.t.phonenumber')" align="center" key="phonenumber" prop="phonenumber"
                  v-if="columns[4].visible" width="120" />
               <el-table-column :label="$t('public.status')" align="center" key="status" v-if="columns[5].visible">
                  <template #default="scope">
                     <el-switch v-model="scope.row.status" active-value="1" inactive-value="0"
                        @change="handleStatusChange(scope.row)">
                     </el-switch>
                  </template>
               </el-table-column>
               <el-table-column :label="$t('public.createdTime')" align="center" prop="createdAt"
                  v-if="columns[6].visible" width="160">
                  <template #default="scope">
                     <span>{{ parseTime(scope.row.createdAt) }}</span>
                  </template>
               </el-table-column>
               <el-table-column :label="$t('public.operate')" align="center" width="150"
                  class-name="small-padding fixed-width">
                  <template #default="scope">
                     <el-tooltip :content="$t('public.modify')" placement="top" v-if="scope.row.userId !== 1">
                        <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"
                           v-hasPermi="['system:user:edit']"></el-button>
                     </el-tooltip>
                     <el-tooltip :content="$t('public.delete')" placement="top" v-if="scope.row.userId !== 1">
                        <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"
                           v-hasPermi="['system:user:remove']"></el-button>
                     </el-tooltip>
                     <el-tooltip :content="$t('login.resetPassword')" placement="top" v-if="scope.row.userId !== 1">
                        <el-button link type="primary" icon="Key" @click="handleResetPwd(scope.row)"
                           v-hasPermi="['system:user:resetPwd']"></el-button>
                     </el-tooltip>
                     <el-tooltip :content="$t('user.a.assigningRoles')" placement="top" v-if="scope.row.userId !== 1">
                        <el-button link type="primary" icon="CircleCheck" @click="handleAuthRole(scope.row)"
                           v-hasPermi="['system:user:edit']"></el-button>
                     </el-tooltip>
                  </template>
               </el-table-column>
            </el-table>
            <pagination v-show="total > 0" :total="total" v-model:page="queryParams.pageNum"
               v-model:limit="queryParams.pageSize" @pagination="getList" />
         </el-col>
      </el-row>

      <!-- 用户导入对话框 -->
      <el-dialog :title="upload.title" v-model="upload.open" width="400px" append-to-body>
         <el-upload ref="uploadRef" :limit="1" accept=".xlsx, .xls" :headers="upload.headers"
            :action="upload.url + '?updateSupport=' + upload.updateSupport" :disabled="upload.isUploading"
            :on-progress="handleFileUploadProgress" :on-success="handleFileSuccess" :auto-upload="false" drag>
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
               <div class="el-upload__tip text-center">
                  <div class="el-upload__tip">
                     <el-checkbox v-model="upload.updateSupport" />是否更新已经存在的用户数据
                  </div>
                  <span>仅允许导入xls、xlsx格式文件。</span>
                  <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;"
                     @click="importTemplate">下载模板</el-link>
               </div>
            </template>
         </el-upload>
         <template #footer>
            <div class="dialog-footer">
               <el-button type="primary" @click="submitFileForm">确 定</el-button>
               <el-button @click="upload.open = false">取 消</el-button>
            </div>
         </template>
      </el-dialog>

      <Edit ref="editRef" @onClose="getList()" />
   </div>
</template>

<script setup name="User">
import { getToken } from "@/utils/auth";
import { changeUserStatus, listUser, resetUserPwd, delUser, deptTreeSelect } from "@/api/system/user";
import Edit from './edit.vue'

const router = useRouter();
const { proxy } = getCurrentInstance();

const editRef = ref()

const userList = ref([]);

const loading = ref(true);
const showSearch = ref(true);
const ids = ref([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const dateRange = ref([]);
const deptName = ref("");
const deptOptions = ref([]);

/*** 用户导入参数 */
const upload = reactive({
   // 是否显示弹出层（用户导入）
   open: false,
   // 弹出层标题（用户导入）
   title: "",
   // 是否禁用上传
   isUploading: false,
   // 是否更新已经存在的用户数据
   updateSupport: 0,
   // 设置上传的请求头部
   headers: { Authorization: "Bearer " + getToken() },
   // 上传的地址
   url: import.meta.env.VITE_APP_BASE_API + "/system/user/importData"
});
// 列显隐信息
const columns = ref([
   { key: 0, label: `用户编号`, visible: true },
   { key: 1, label: `用户账户`, visible: true },
   { key: 2, label: `用户昵称`, visible: true },
   { key: 3, label: `部门`, visible: true },
   { key: 4, label: `手机号码`, visible: true },
   { key: 5, label: `状态`, visible: true },
   { key: 6, label: `创建时间`, visible: true }
]);

const queryParams = ref({
   pageNum: 1,
   pageSize: 10,
   userName: undefined,
   phonenumber: undefined,
   status: undefined,
   deptId: undefined
})
/** 通过条件过滤节点  */
const filterNode = (value, data) => {
   if (!value) return true;
   return data.label.indexOf(value) !== -1;
};
/** 根据名称筛选部门树 */
watch(deptName, val => {
   proxy.$refs["deptTreeRef"].filter(val);
});
/** 查询部门下拉树结构 */
function getDeptTree() {
   deptTreeSelect().then(response => {
      deptOptions.value = response;
   });
};
/** 查询用户列表 */
function getList() {
   loading.value = true;
   listUser(proxy.addDateRange(queryParams.value, dateRange.value)).then(res => {
      loading.value = false;
      userList.value = res.rows;
      total.value = res.total;
   });
};
/** 节点单击事件 */
function handleNodeClick(data) {
   queryParams.value.deptId = data.id;
   handleQuery();
};
/** 搜索按钮操作 */
function handleQuery() {
   queryParams.value.pageNum = 1;
   getList();
};
/** 重置按钮操作 */
function resetQuery() {
   dateRange.value = [];
   proxy.resetForm("queryRef");
   queryParams.value.deptId = undefined;
   proxy.$refs.deptTreeRef.setCurrentKey(null);
   handleQuery();
};
/** 删除按钮操作 */
function handleDelete(row) {
   const userIds = row.userId || ids.value;
   proxy.$modal.confirm('是否确认删除用户编号为"' + userIds + '"的数据项？').then(function () {
      return delUser(userIds);
   }).then(() => {
      getList();
      proxy.$modal.msgSuccess("删除成功");
   }).catch(() => { });
};
/** 导出按钮操作 */
function handleExport() {
   proxy.download("system/user/export", {
      ...queryParams.value,
   }, `user_${new Date().getTime()}.xlsx`);
};
/** 用户状态修改  */
function handleStatusChange(row) {
   if (!row.status) return
   let text = row.status === "1" ? "启用" : "停用";
   proxy.$modal.confirm('确认要"' + text + '""' + row.userName + '"用户吗?').then(function () {
      return changeUserStatus(row.userId, row.status);
   }).then(() => {
      proxy.$modal.msgSuccess(text + "成功");
   }).catch(function () {
      row.status = row.status === "0" ? "1" : "0";
   });
};
/** 跳转角色分配 */
function handleAuthRole(row) {
   const userId = row.userId;
   router.push("/system/user-auth/role/" + userId);
};
/** 重置密码按钮操作 */
function handleResetPwd(row) {
   proxy.$prompt('请输入"' + row.userName + '"的新密码', "提示", {
      confirmButtonText: "确定",
      cancelButtonText: "取消",
      closeOnClickModal: false,
      inputPattern: /^.{5,20}$/,
      inputValue: "123456",
      inputErrorMessage: "用户密码长度必须介于 5 和 20 之间",
   }).then(({ value }) => {
      resetUserPwd(row.userId, value).then(response => {
         proxy.$modal.msgSuccess("修改成功，新密码是：" + value);
      });
   }).catch(() => { });
};
/** 选择条数  */
function handleSelectionChange(selection) {
   ids.value = selection.map(item => item.userId);
   single.value = selection.length != 1;
   multiple.value = !selection.length;
};
/** 导入按钮操作 */
function handleImport() {
   upload.title = "用户导入";
   upload.open = true;
};
/** 下载模板操作 */
function importTemplate() {
   proxy.download("system/user/importTemplate", {
   }, `user_template_${new Date().getTime()}.xlsx`);
};
/**文件上传中处理 */
const handleFileUploadProgress = (event, file, fileList) => {
   upload.isUploading = true;
};
/** 文件上传成功处理 */
const handleFileSuccess = (response, file, fileList) => {
   upload.open = false;
   upload.isUploading = false;
   proxy.$refs["uploadRef"].handleRemove(file);
   proxy.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
   getList();
};
/** 提交上传文件 */
function submitFileForm() {
   proxy.$refs["uploadRef"].submit();
};
/** 新增按钮操作 */
function handleAdd() {
   editRef.value?.handleAdd(deptOptions.value);
};
/** 修改按钮操作 */
function handleUpdate(row) {
   editRef.value?.handleUpdate(row, ids.value, deptOptions.value);
};

getDeptTree();
getList();
</script>
