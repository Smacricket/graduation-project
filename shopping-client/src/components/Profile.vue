<template>
  <div>
    <div class="profile">
      <div
        v-for="(profile, index) in profiles"
        :key="index"
        style="width: 25%"
        :class="{ active: profile.selected }"
        @click="handleSelectedProfile(index)"
      >
        <el-card shadow="hover" class="card_info">
          <p>{{ profile.name }}</p>
          <p>{{ profile.phone }}</p>
          <p>
            {{ profile.province }}{{ profile.city }}{{ profile.area
            }}{{ profile.address }}
          </p>
          <p
            class="edit"
            @click="handleOpenEditDialog('修改收货地址', profile)"
          >
            <span>修改</span>
          </p>
          <p
            class="del_btn"
            title="删除"
            @click="handelDeleteProfile(profile.id)"
          >
            <i class="el-icon-delete"></i>
          </p>
        </el-card>
      </div>
      <el-card class="cart_add" shadow="hover" style="width: 25%">
        <el-button
          type="info"
          icon="el-icon-plus"
          circle
          @click="handleOpenAddDialog('添加收货地址')"
        ></el-button>
        <p>添加新地址</p>
      </el-card>
    </div>
    <el-dialog :title="dialogTitle" :visible.sync="dialogFormVisible">
      <el-form :model="currentProfile" :rules="rules" ref="currentProfile">
        <el-form-item prop="name" label="收件人">
          <el-input v-model="currentProfile.name"></el-input>
        </el-form-item>
        <el-form-item prop="phone" label="联系电话">
          <el-input v-model="currentProfile.phone"></el-input>
        </el-form-item>
        <el-form-item label="选择收货地址">
          <v-distpicker
            :province="currentProfile.province"
            :city="currentProfile.city"
            :area="currentProfile.area"
            @selected="handleSelectedAddress"
          ></v-distpicker>
        </el-form-item>
        <el-form-item prop="address" label="详细地址">
          <el-input v-model="currentProfile.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('currentProfile')">取 消</el-button>
        <el-button
          type="primary"
          v-if="flag"
          @click="handleAddProfile('currentProfile')"
          >确 定</el-button
        >
        <el-button
          type="primary"
          v-else
          @click="handleUpdateProfile('currentProfile')"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import VDistpicker from "v-distpicker";
import { Message } from "element-ui";
import { validatePhone } from "@/util/reg.js";

export default {
  name: "Profile",
  props: {},
  data() {
    return {
      profiles: [],
      user: JSON.parse(localStorage.getItem("userInfo")),
      dialogFormVisible: false,
      dialogTitle: "",
      flag: false,
      lastIndex: 0,
      currentProfile: {
        name: "",
        phone: "",
        province: "广东省",
        city: "广州市",
        area: "海珠区",
        address: ""
      },
      rules: {
        name: [
          { required: true, message: "请输入收件人姓名", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "请输入联系电话" },
          { validator: validatePhone, trigger: "blur" }
        ],
        address: [
          { required: true, message: "请输入收货地址", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.handleGetAllProfiles();
  },
  methods: {
    handleGetAllProfiles() {
      this.$axios
        .post("/api/user/getAllProfiles", { u_id: this.user.id })
        .then(res => {
          if (res.data.code === 0) {
            this.profiles = res.data.profiles;
            // 这里for循环有点问题
            for (let profile of this.profiles) {
              profile.selected = false;
            }
            return;
          }
          this.profiles = [];
        });
    },
    handleOpenAddDialog(title) {
      this.dialogTitle = title;
      this.dialogFormVisible = true;
      this.flag = true;
    },
    handleOpenEditDialog(title, profile) {
      this.dialogTitle = title;
      this.currentProfile = profile;
      this.dialogFormVisible = true;
      this.flag = false;
    },
    handleAddProfile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/user/add_profile", {
              u_id: this.user.id,
              name: this.currentProfile.name,
              phone: this.currentProfile.phone,
              province: this.currentProfile.province,
              city: this.currentProfile.city,
              area: this.currentProfile.area,
              address: this.currentProfile.address
            })
            .then(res => {
              if (res.data.code === 0) {
                Message.success("添加成功");
                this.resetForm(formName);
                this.dialogFormVisible = false;
                this.handleUpdateView();
                return;
              }
              Message.error("添加失败");
              this.dialogFormVisible = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          Message.error("请确认是否正确输入");
        }
      });
    },
    handleUpdateProfile(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/api/user/update_profile", this.currentProfile)
            .then(res => {
              if (res.data.code === 0) {
                Message.success("修改成功");
                this.resetForm(formName);
                this.dialogFormVisible = false;
                this.handleUpdateView();
                return;
              }
              Message.error("修改失败");
              this.dialogFormVisible = false;
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          Message.error("请确认是否正确输入");
        }
      });
    },
    handelDeleteProfile(id) {
      this.$axios
        .post("/api/user/delete_profile", {
          id: id
        })
        .then(res => {
          if (res.data.code === 0) {
            Message.success("删除成功");
            this.handleUpdateView();
            return;
          }
          Message.error("删除失败");
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleUpdateView() {
      this.$nextTick(() => {
        this.handleGetAllProfiles();
      });
    },
    handleSelectedProfile(index) {
      if (index === this.lastIndex) {
        this.$forceUpdate();
        this.$set(this.profiles[index], "selected", true);
        this.$emit("handleReturnProfile", this.profiles[this.lastIndex]);
        return;
      }
      this.$forceUpdate();
      this.$set(this.profiles[this.lastIndex], "selected", false);
      this.$set(this.profiles[index], "selected", true);
      this.lastIndex = index;
      this.$emit("handleReturnProfile", this.profiles[this.lastIndex]);
    },
    handleSelectedAddress(data) {
      this.currentProfile.province = data.province.value;
      this.currentProfile.city = data.city.value;
      this.currentProfile.area = data.area.value;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      let temp = {
        name: "",
        phone: "",
        province: "广东省",
        city: "广州市",
        area: "海珠区",
        address: ""
      };
      this.currentProfile = JSON.parse(JSON.stringify(temp));
      this.dialogFormVisible = false;
    }
  },
  components: {
    VDistpicker
  }
};
</script>

<style scoped lang="scss">
.el-card {
  height: 200px;
  position: relative;
}
.profile {
  display: flex;
  margin: 1em 2em;
  :first-child .card_info {
    margin-left: 0;
  }
  .card_info {
    margin-left: 1em;
  }
  p:first-child {
    margin-bottom: 1em;
  }
  p + p {
    font-size: 14px;
    color: #757575;
    padding: 3px 0;
  }
  .edit {
    color: #ff6700;
    position: absolute;
    bottom: 1em;
    right: 2em;
    :hover {
      color: #ff3300;
    }
  }
  .del_btn {
    position: absolute;
    top: 1em;
    right: 2em;
    :hover {
      color: #ff6700;
    }
  }
  .cart_add {
    margin-left: 1em;
    text-align: center;
    .el-button {
      margin-top: 4em;
    }
  }
}
.active {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
