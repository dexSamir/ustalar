import React, { useRef, useState } from "react";
import { ImageIcon, Star } from "lucide-react";

export default function ReviewForm() {
  const inputref = useRef(null);
  const handleclick = () => inputref.current?.click();
  const TAGS = [
    "#Məsuliyyət",
    "#Səliqə",
    "#Vaxta nəzarət",
    "#Ünsiyyətcil",
    "#Dəqiq",
    "#Peşəkar",
    "#Təcrübəli",
    "#Səmərəli",
    "#Çevik",
    "#Səbirli",
  ];

  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [ratingError, setRatingError] = useState("");
  const [textError, setTextError] = useState("");
  const [tagError, setTagError] = useState("");

  const [imageError, setImageError] = useState("");
  const [submitStatus, setSubmitStatus] = useState({
    loading: false,
    success: false,
    message: "",
  });

  const [tags, setTags] = useState([]);
  const tagselector = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
      setError("");
    } else if (tags.length < 5) {
      setTags([...tags, tag]);
      setError("");
    } else {
      setError("5 tagdan artıq seçə bilməzsiniz");
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    let isValid = true;

    if (rating === 0) {
      setRatingError("Lütfən bir reytinq seçin");
      isValid = false;
    } else {
      setRatingError("");
    }

    if (text.trim() === "") {
      setTextError("Zəhmət olmasa rəyinizi yazın");
      isValid = false;
    } else {
      setTextError("");
    }

    if (tags.length === 0) {
      setTagError("Zəhmət olmasa ən azı bir etiket seçin");
      isValid = false;
    } else {
      setTagError("");
    }

    if (!isValid) {
      setSubmitStatus({
        loading: false,
        success: false,
        message: "Zəhmət olmasa bütün tələb olunan sahələri doldurun.",
      });
      return;
    }

    setSubmitStatus({ loading: true, success: false, message: "" });

    const formData = new FormData();
    formData.append("name", e.target.name.value);
    formData.append("rating", rating);
    formData.append("text", text);
    formData.append("tags", JSON.stringify(tags));

    images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    try {
      const response = await fetch(
        "https://masters-1.onrender.com/api/v1/professionals/1/reviews/create",
        {
          method: "POST",
          body: formData,
        }
      );

      if (response.ok) {
        setSubmitStatus({
          loading: false,
          success: true,
          message: "Rəyiniz uğurla göndərildi!",
        });
        setRating(0);
        setText("");
        setTags([]);
        setImages([]);
        setInputKey(Date.now());
        e.target.name.value = "";
      } else {
        const errorData = await response.json();
        setSubmitStatus({
          loading: false,
          success: false,
          message: `Rəy göndərilərkən xəta baş verdi: ${
            errorData.detail || JSON.stringify(errorData)
          }`,
        });
      }
    } catch (err) {
      setSubmitStatus({
        loading: false,
        success: false,
        message: `Şəbəkə xətası: ${err.message}`,
      });
    }
  };
  const [images, setImages] = useState([]);
  const [inputKey, setInputKey] = useState(Date.now());

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    const totalImages = [...images, ...selectedFiles];

    const oversized = selectedFiles.some((file) => file.size > 5 * 1024 * 1024);
    if (oversized) {
      setImageError("Şəklin ölçüsü 5MB-dan çox ola bilməz.");
      setInputKey(Date.now());
      return;
    }

    if (totalImages.length > 3) {
      setImageError("Ən çox 3 şəkil yükləyə bilərsiniz.");
      setInputKey(Date.now());
      return;
    }

    setImages(totalImages);
    setImageError("");
  };

  return (
    <form
      className="mx-auto p-6 max-w-[1400px] bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <h2 className="font-bold text-xl mb-4">Xidmət haqqında rəy yazın</h2>
      {submitStatus.message && (
        <div
          className={`mb-4 p-3 rounded-md text-center ${
            submitStatus.success
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {submitStatus.message}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="name" className="block font-semibold mb-3">
          Adınızı və soyadınızı qeyd edin
        </label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Adınızı qeyd edin"
          className="w-full border border-gray-300 rounded p-[5px] mb-[30px] focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">
          Xidmətlə bağlı təəssüratınız necə idi?
        </label>
        <div className="flex gap-[3px] text-[25px] mb-[10px] cursor-pointer">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`cursor-pointer ${
                star <= rating
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-yellow-400"
              }`}
              onClick={() => setRating(star === rating ? 0 : star)}
            />
          ))}
        </div>
        {ratingError && (
          <p className="text-red-500 text-sm mb-[30px] font-semibold">
            {ratingError}
          </p>
        )}

        <textarea
          placeholder='"Yaşadığınız təcrübəni bizimlə bölüşün" '
          className="w-full border border-gray-300 h-[147px] rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e) => setText(e.target.value)}
          value={text}
        ></textarea>
        {textError && (
          <p className="text-red-500 text-sm mb-[30px] font-semibold">
            {textError}
          </p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-semibold mt-[40px]">
          Şəkil əlavə edin (istəyə bağlıdır)
        </label>
        <div
          className="w-48 h-48 border-dashed border-gray-300 border flex flex-col items-center justify-center mb-[50px] cursor-pointer text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors"
          onClick={handleclick}
        >
          <span className="mb-1">Şəkil əlavə edin</span>
          <ImageIcon className="w-6 h-6" />
          <input
            type="file"
            ref={inputref}
            key={inputKey}
            className="hidden"
            accept="image/*"
            multiple
            onChange={handleImageChange}
          />
        </div>
        {images.length > 0 && (
          <div className="flex gap-4 flex-wrap mb-4">
            {images.map((image, index) => (
              <img
                key={index}
                src={URL.createObjectURL(image) || "/placeholder.svg"}
                alt={`şəkil-${index}`}
                className="w-[100px] h-[100px] object-cover rounded border border-gray-300"
              />
            ))}
          </div>
        )}
      </div>
      {imageError && (
        <p className="text-red-500 text-sm mt-2 font-semibold">{imageError}</p>
      )}

      <div className="mb-4 max-w-[750px]">
        <p className="font-semibold mb-[20px]">
          Xidməti xarakterizə edən etiketləri seçin (maks. 5 ədəd)
        </p>
        <div className="flex flex-wrap gap-[10px]">
          {TAGS.map((tag) => (
            <button
              type="button"
              onClick={() => tagselector(tag)}
              className={`border px-[10px] py-[7px] rounded text-[16px] transition-colors duration-200
            ${
              tags.includes(tag)
                ? "border-red-600 bg-[#cde4f2] text-[#1a4862]"
                : "bg-[#cde4f2] text-[#1a4862] hover:bg-blue-100"
            }`}
              key={tag}
            >
              {tag}
            </button>
          ))}
        </div>
        {error && (
          <p className="text-red-500 text-sm mt-2 font-semibold">{error}</p>
        )}
      </div>
      {tagError && (
        <p className="text-red-500 text-sm mb-[30px] font-semibold">
          {tagError}
        </p>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-lg font-semibold"
        disabled={submitStatus.loading}
      >
        {submitStatus.loading ? "Göndərilir..." : "Rəyinizi göndərin"}
      </button>
    </form>
  );
}
