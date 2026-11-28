import BrandCmsEditor from "@/components/admin/cms/BrandCmsEditor";
import CatalogCmsEditor from "@/components/admin/cms/CatalogCmsEditor";
import CourseReviewsCmsEditor from "@/components/admin/cms/CourseReviewsCmsEditor";
import CvCmsEditor from "@/components/admin/cms/CvCmsEditor";
import GalleryCmsEditor from "@/components/admin/cms/GalleryCmsEditor";
import HomeCmsEditor from "@/components/admin/cms/HomeCmsEditor";
import ProjectsCmsEditor from "@/components/admin/cms/ProjectsCmsEditor";

export function AdminHomeCmsPage() {
  return <HomeCmsEditor />;
}

export function AdminCatalogCmsPage() {
  return <CatalogCmsEditor />;
}

export function AdminProjectsCmsPage() {
  return <ProjectsCmsEditor />;
}

export function AdminCvCmsPage() {
  return <CvCmsEditor />;
}

export function AdminGalleryCmsPage() {
  return <GalleryCmsEditor />;
}

export function AdminBrandCmsPage() {
  return <BrandCmsEditor />;
}

export function AdminCourseReviewsCmsPage() {
  return <CourseReviewsCmsEditor />;
}
