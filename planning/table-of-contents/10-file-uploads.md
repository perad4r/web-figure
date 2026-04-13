# Chapter 10 — File Uploads

## Laravel → Node.js Mapping

| Laravel | Node.js |
|---------|---------|
| `$request->file('hinh_anh')` | `req.file` (multer) |
| `$file->store('products', 'public')` | `multer({ dest: 'public/uploads/' })` |
| `asset('storage/' . $path)` | `/uploads/filename.jpg` |
| Storage facade | fs module / multer disk storage |

---

## Multer Configuration (`config/upload.js`)

```js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../public/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `${uniqueName}${path.extname(file.originalname)}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

module.exports = upload;
```

---

## Usage in Routes

### Product Image

```js
// routes/admin/products.js
const upload = require('../../config/upload');

router.post('/', upload.single('hinh_anh'), productAdmin.store);
router.put('/:id', upload.single('hinh_anh'), productAdmin.update);
```

### Variant Image

```js
// routes/admin/variants.js
router.post('/', upload.single('hinh_anh'), variantAdmin.store);
router.put('/:id', upload.single('hinh_anh'), variantAdmin.update);
```

---

## Controller Handling

```js
// In controller
const imagePath = req.file ? req.file.filename : null;

await Hang.query().insert({
  ten: req.body.ten,
  gia: req.body.gia,
  hinh_anh: imagePath,
  // ...
});
```

## Image URL Resolution

Serve uploaded files via Express static middleware:

```js
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
```

In templates: `<img src="/uploads/<%= product.hinh_anh %>">`

---

## Cleanup on Delete

When deleting a product/variant, remove the image file:

```js
const fs = require('fs').promises;
const filePath = path.join(__dirname, '../../public/uploads', product.hinh_anh);
await fs.unlink(filePath).catch(() => {}); // Ignore if not found
```
