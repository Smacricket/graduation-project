<template>
  <div class="cart">
    <div class="cart_hd">
      <h1>购物车</h1>
      <div class="line"></div>
    </div>
    <div class="container">
      <div class="cart_main">
        <!-- 有效商品 -->
        <el-table
          :data="carts"
          ref="multipleTable"
          style="width: 80%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column align="center">
            <template slot-scope="scope">
              <el-image :src="scope.row.img_path"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <span class="tb_name">{{ scope.row.g_name }}</span>
              <p class="tb_param">{{ scope.row.param }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" align="center">
          </el-table-column>
          <el-table-column label="数量" width="200" align="center">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.count"
                :min="1"
                :max="10"
                @change="
                  handleChange(scope.row.id, scope.row.count, scope.row.price)
                "
              ></el-input-number>
            </template>
          </el-table-column>
          <el-table-column label="小计" align="center">
            <template slot-scope="scope">
              <span class="tb_total">{{ scope.row.sub_total }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-close"
                circle
                title="删除"
                class="btn_del"
                @click="handleOpenDialog(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- 失效商品 -->
        <el-divider
          content-position="left"
          v-if="invalidCart && invalidCart.length"
          ><i class="el-icon-arrow-down"></i>失效商品</el-divider
        >
        <el-table
          :data="invalidCart"
          style="width: 80%"
          v-if="invalidCart && invalidCart.length"
        >
          <el-table-column align="center">
            <template slot-scope="scope">
              <el-image :src="scope.row.img_path"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" align="center">
            <template slot-scope="scope">
              <span class="tb_name">{{ scope.row.g_name }}</span>
              <p class="tb_param">{{ scope.row.param }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="单价" align="center">
          </el-table-column>
          <el-table-column label="操作" width="100" align="center">
            <template slot-scope="scope">
              <el-button
                icon="el-icon-close"
                circle
                title="删除"
                class="btn_del"
                @click="handleOpenDialog(scope.row.id)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="cart_footer">
        <p class="details">
          共 <span>{{ totalGoods }}</span> 件商品，已选择
          <span>{{ selectedGoods }}</span> 件
        </p>
        <p class="footer_total">
          合计: <span>{{ totalPrice }}</span
          >元
        </p>
        <el-button @click="handleGoto('order')">去结算</el-button>
      </div>
    </div>
    <el-dialog :visible.sync="dialogVisible" width="30%" center>
      <h1 class="dialog_title">确认删除吗</h1>
      <span slot="footer" class="dialog-footer">
        <el-button class="btn_cancel" @click="dialogVisible = false"
          >取 消</el-button
        >
        <el-button class="btn_confirm" @click="handleDelete">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { Message } from "element-ui";

export default {
  name: "Cart",
  props: {
    showSearchInput: Boolean,
  },
  data() {
    return {
      currentId: "",
      cartsData: [],
      multipleSelection: [],
      totalGoods: 0,
      selectedGoods: 0,
      totalPrice: 0,
      dialogVisible: false,
      invalidCart: null,
      showValid: true,
    };
  },
  created() {
    this.handleUpdateCarts();
    this.$emit("handleHideSearch", false);
  },
  computed: {
    carts: {
      get() {
        return this.$store.getters.carts;
      },
      set(val) {
        this.cartsData = val;
      },
    },
    userInfo() {
      return JSON.parse(localStorage.getItem("userInfo"));
    },
  },
  watch: {
    $route(to) {
      if (to.path === "/cart") {
        this.multipleSelection = [];
      }
    },
  },
  methods: {
    handleGetCart() {
      this.$axios
        .post("/api/cart/getUserCart", { u_id: this.userInfo.id })
        .then((res) => {
          // debugger;
          if (res.data.code === 0) {
            this.carts = res.data.validCart;
            this.invalidCart = res.data.invalidCart;
            this.$store.dispatch("setCarts", res.data.validCart);
          } else {
            this.carts = null;
            this.invalidCart = null;
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    handleSetTotalGoods() {
      this.totalGoods = 0;
      if (this.carts.length) {
        for (let cart of this.carts) {
          this.totalGoods += cart.count;
        }
        return;
      }
      this.totalGoods = 0;
    },
    handleSelectionChange(val) {
      if (val.length) {
        this.multipleSelection = val;
        this.selectedGoods = 0;
        this.totalPrice = 0;
        for (let item of val) {
          this.selectedGoods += item.count;
          this.totalPrice += item.sub_total;
        }
        return;
      }
      this.selectedGoods = 0;
    },
    // 打开确认框
    handleOpenDialog(id) {
      this.dialogVisible = true;
      this.currentId = id;
    },
    // 点击确认删除商品
    handleDelete() {
      this.$axios
        .post("/api/cart/delete", {
          id: this.currentId,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.dialogVisible = false;
            this.handleUpdateCarts();
            Message.success("删除成功");
            return;
          }
          Message.error("删除失败");
        });
    },
    // 监听change更新购物车
    handleChange(id, count, price) {
      this.$axios
        .post("/api/cart/update", {
          id: id,
          count: count,
          price: price,
        })
        .then((res) => {
          if (res.data.code === 0) {
            this.handleUpdateCarts();
            this.totalPrice = 0;
            return;
          }
          Message.error("增加数量失败");
        });
    },
    // 更新页面数据
    handleUpdateCarts() {
      this.$nextTick(() => {
        this.handleGetCart();
        this.handleSetTotalGoods();
      });
    },
    handleGoto(path) {
      if (this.multipleSelection.length) {
        this.$router.push({
          name: path,
          params: {
            selectedGoods: this.multipleSelection,
          },
        });
        return;
      }
      Message.warning("请选择结算商品");
    },
  },
};
</script>

<style scoped lang="scss">
.cart_hd h1 {
  font-size: 30px;
  font-weight: 100;
  margin: 2rem 0 2rem 5rem;
}
.line {
  width: 100%;
  background: #ff6700;
  height: 2px;
}
.container {
  background: #f5f5f5;
}
.cart_main {
  padding: 2em 0;
  .tb_header {
    width: 80%;
    margin: auto;
    display: flex;
    justify-content: flex-end;
  }
  .btn_show {
    margin: 1em 0;
  }
  .el-table {
    margin: auto;
  }
  .el-image {
    width: 100px;
    height: 100px;
  }
  .btn_del {
    border: none;
  }
}

// 除了表头的row
.el-table ::v-deep .el-table__row {
  height: 100px;
  font-size: 16px;
}
// 表头
.el-table ::v-deep tr {
  height: 5em;
}

.tb_name {
  font-size: 18px;
}
.tb_total {
  color: #ff6700;
}
.tb_param {
  font-size: 14px;
  color: #ff6700;
}

.cart_footer {
  position: -webkit-sticky;
  position: sticky;
  bottom: 0;
  width: 80%;
  margin: 0 auto;
  border-bottom: 2em solid #f5f5f5;
  background: #fff;
  line-height: 50px;
  vertical-align: middle;
  display: flex;
  z-index: 2;
  .details {
    color: #757575;
    span {
      color: #ff6700;
    }
  }
  .footer_total {
    margin-left: auto;
    color: #ff6700;
    span {
      font-size: 30px;
    }
  }
  .el-button {
    background: #ff6700;
    color: #fff;
    font-size: 18px;
    width: 200px;
    margin-left: 2em;
  }
}

.dialog_title {
  font-size: 20px;
  font-weight: bold;
  width: 120px;
  margin: auto;
}
.btn_cancel {
  background: #b0b0b0;
  color: #fff;
}
.btn_confirm {
  background: #ff6700;
  color: #fff;
}

.el-divider__text.is-left {
  left: 140px;
}
.el-divider__text {
  font-size: 18px;
  color: rgba($color: red, $alpha: 0.8);
}
</style>
